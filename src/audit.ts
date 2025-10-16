// src/audit.ts
import { chromium, Page, Response } from "@playwright/test";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import os from "os";
import pLimit from "p-limit";
import chalk from "chalk";

type Finding =
  | { type: "http_error"; url: string; status: number }
  | { type: "image_broken"; page: string; src: string; detail: string }
  | { type: "image_hidden"; page: string; src: string; reason: string; cssPath: string }
  | { type: "overlay_block"; page: string; blocker: string; blockedTag: string; percentCovered: number }
  | { type: "console_error"; page: string; message: string }
  | { type: "route_404"; from: string; to: string }
  | { type: "asset_missing"; page: string; href: string; status: number };

type Report = {
  startedAt: string;
  baseUrl: string;
  pagesScanned: number;
  linksTested: number;
  imagesChecked: number;
  findings: Finding[];
  summary: {
    httpErrors: number;
    brokenImages: number;
    hiddenImages: number;
    overlays: number;
    consoleErrors: number;
    route404: number;
    assetsMissing: number;
  };
};

const BASE_URL = process.env.SITE_URL || "http://localhost:3000";
const MAX_PAGES = parseInt(process.env.MAX_PAGES || "500", 10);
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "6", 10);
const RESPECT_ROBOTS = process.env.RESPECT_ROBOTS !== "false";

function norm(u: string) {
  try {
    return new URL(u, BASE_URL).toString().replace(/[#?].*$/, "");
  } catch {
    return null;
  }
}

async function fetchRobots(): Promise<Set<string>> {
  const disallow = new Set<string>();
  if (!RESPECT_ROBOTS) return disallow;
  try {
    const res = await fetch(new URL("/robots.txt", BASE_URL));
    if (!res.ok) return disallow;
    const txt = await res.text();
    for (const line of txt.split("\n")) {
      const m = line.match(/^Disallow\s*\:\s*(\S+)/i);
      if (m) disallow.add(m[1].trim());
    }
  } catch {}
  return disallow;
}

async function fetchSitemapSeeds(): Promise<string[]> {
  const seeds: string[] = [];
  try {
    const res = await fetch(new URL("/sitemap.xml", BASE_URL));
    if (!res.ok) return seeds;
    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(xml);
    if (data.urlset && Array.isArray(data.urlset.url)) {
      for (const u of data.urlset.url) {
        if (u.loc) seeds.push(u.loc);
      }
    }
    if (data.sitemapindex && Array.isArray(data.sitemapindex.sitemap)) {
      for (const sm of data.sitemapindex.sitemap) {
        if (!sm.loc) continue;
        try {
          const r = await fetch(sm.loc);
          if (!r.ok) continue;
          const xml2 = await r.text();
          const d2 = parser.parse(xml2);
          if (d2.urlset && Array.isArray(d2.urlset.url)) {
            for (const u of d2.urlset.url) {
              if (u.loc) seeds.push(u.loc);
            }
          }
        } catch {}
      }
    }
  } catch {}
  return seeds;
}

function inDisallow(url: string, disallow: Set<string>): boolean {
  const rel = url.replace(BASE_URL, "/");
  for (const rule of disallow) {
    if (rel.startsWith(rule)) return true;
  }
  return false;
}

async function collectLinks(page: Page): Promise<string[]> {
  const hrefs = await page.$$eval("a[href]", as =>
    as
      .map(a => (a as HTMLAnchorElement).getAttribute("href") || "")
      .filter(Boolean),
  );
  const cleaned: string[] = [];
  for (const h of hrefs) {
    const u = norm(h);
    if (!u) continue;
    if (!u.startsWith(BASE_URL)) continue;
    cleaned.push(u);
  }
  return Array.from(new Set(cleaned));
}

async function checkAssets(page: Page, pageUrl: string, findings: Finding[]) {
  const assets = await page.evaluate(() => {
    const set = new Set<string>();
    for (const el of Array.from(document.querySelectorAll("link[href]"))) {
      const href = (el as HTMLLinkElement).href;
      if (href) set.add(href);
    }
    for (const el of Array.from(document.querySelectorAll("script[src]"))) {
      const src = (el as HTMLScriptElement).src;
      if (src) set.add(src);
    }
    for (const el of Array.from(document.querySelectorAll("img[src], source[srcset]"))) {
      const img = el as HTMLImageElement;
      if (img.src) set.add(img.src);
      const srcset = (img as any).srcset as string | undefined;
      if (srcset) {
        for (const part of srcset.split(","))
          set.add(part.trim().split(" ")[0]);
      }
    }
    return Array.from(set);
  });

  const limited = pLimit(12);
  const checks = assets.map(u =>
    limited(async () => {
      try {
        const r = await page.request.get(u, { timeout: 15000 });
        const st = r.status();
        if (st >= 400) {
          findings.push({ type: "asset_missing", page: pageUrl, href: u, status: st });
        }
      } catch {
        findings.push({ type: "asset_missing", page: pageUrl, href: u, status: 0 });
      }
    }),
  );
  await Promise.all(checks);
}

async function checkImages(page: Page, pageUrl: string, findings: Finding[]) {
  const results = await page.evaluate(() => {
    function cssPath(el: Element): string {
      const parts: string[] = [];
      let e: Element | null = el;
      while (e && e.nodeType === 1) {
        let sel = e.nodeName.toLowerCase();
        if ((e as Element).id) {
          sel += "#" + (e as Element).id;
          parts.unshift(sel);
          break;
        } else {
          let sib = e;
          let nth = 1;
          while ((sib = sib.previousElementSibling as Element | null)) {
            if (sib.nodeName === e.nodeName) nth++;
          }
          sel += `:nth-of-type(${nth})`;
        }
        parts.unshift(sel);
        e = e.parentElement;
      }
      return parts.join(" > ");
    }

    const data: {
      broken: { src: string; detail: string }[];
      hidden: { src: string; reason: string; cssPath: string }[];
      overlays: { blocker: string; blockedTag: string; percentCovered: number }[];
    } = { broken: [], hidden: [], overlays: [] };

    const imgs = Array.from(document.images);
    for (const img of imgs) {
      try {
        const ok = img.complete && img.naturalWidth > 0;
        if (!ok) {
          data.broken.push({ src: img.src || "(empty)", detail: "incomplete or zero natural size" });
          continue;
        }

        const cs = getComputedStyle(img);
        if (cs.display === "none" || cs.visibility !== "visible") {
          data.hidden.push({ src: img.src, reason: "not visible", cssPath: cssPath(img) });
          continue;
        }
        const op = parseFloat(cs.opacity || "1");
        if (op < 0.5) {
          data.hidden.push({ src: img.src, reason: `low opacity ${op}`, cssPath: cssPath(img) });
        }

        const rect = img.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) {
          data.hidden.push({ src: img.src, reason: "tiny box", cssPath: cssPath(img) });
        }
      } catch {}
    }

    function area(r: DOMRect) {
      return Math.max(0, r.width) * Math.max(0, r.height);
    }

    const blockers = Array.from(document.querySelectorAll("*")).filter(el => {
      const cs = getComputedStyle(el as Element);
      if (cs.pointerEvents === "none") return false;
      const pos = cs.position;
      if (!(pos === "fixed" || pos === "absolute" || pos === "sticky")) return false;
      const op = parseFloat(cs.opacity || "1");
      const bg = cs.backgroundImage || "";
      const hasGradient = bg.includes("gradient");
      const z = parseInt(cs.zIndex || "0", 10);
      const rect = (el as Element).getBoundingClientRect();
      const coversScreen = rect.width * rect.height > window.innerWidth * window.innerHeight * 0.25;
      return (hasGradient || op > 0.02) && z >= 1 && coversScreen;
    });

    if (blockers.length && imgs.length) {
      for (const b of blockers) {
        const br = (b as Element).getBoundingClientRect();
        for (const img of imgs) {
          const ir = img.getBoundingClientRect();
          const xOverlap = Math.max(0, Math.min(br.right, ir.right) - Math.max(br.left, ir.left));
          const yOverlap = Math.max(0, Math.min(br.bottom, ir.bottom) - Math.max(br.top, ir.top));
          const overlap = xOverlap * yOverlap;
          const pct = area(ir) ? overlap / area(ir) : 0;
          if (pct > 0.5) {
            data.overlays.push({
              blocker: (b as Element).tagName.toLowerCase(),
              blockedTag: "img",
              percentCovered: Math.round(pct * 100),
            });
          }
        }
      }
    }

    return data;
  });

  for (const b of results.broken) {
    findings.push({ type: "image_broken", page: pageUrl, src: b.src, detail: b.detail });
  }
  for (const h of results.hidden) {
    findings.push({ type: "image_hidden", page: pageUrl, src: h.src, reason: h.reason, cssPath: h.cssPath });
  }
  for (const o of results.overlays) {
    findings.push({ type: "overlay_block", page: pageUrl, blocker: o.blocker, blockedTag: o.blockedTag, percentCovered: o.percentCovered });
  }
}

async function crawl() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const findings: Finding[] = [];
  const seen = new Set<string>();
  const queue: string[] = [];

  const disallow = await fetchRobots();
  const seeds = await fetchSitemapSeeds();

  const start = new URL(BASE_URL).toString();
  if (!seeds.includes(start)) seeds.unshift(start);
  for (const s of seeds) {
    const u = norm(s);
    if (!u) continue;
    if (inDisallow(u, disallow)) continue;
    queue.push(u);
  }

  const limit = pLimit(CONCURRENCY);
  const allLinks: Set<string> = new Set();

  page.on("console", msg => {
    if (msg.type() === "error") {
      findings.push({ type: "console_error", page: page.url(), message: msg.text() });
    }
  });

  let linksTested = 0;
  let imagesChecked = 0;

  async function visit(url: string) {
    const res = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => null);
    if (!res) {
      findings.push({ type: "http_error", url, status: 0 });
      return;
    }
    const st = res.status();
    if (st >= 400) {
      findings.push({ type: "http_error", url, status: st });
      return;
    }

    await page.waitForTimeout(300);

    const links = await collectLinks(page);
    links.forEach(l => allLinks.add(l));

    await checkAssets(page, url, findings);
    await checkImages(page, url, findings);

    const imgCount = await page.evaluate(() => Array.from(document.images).length);
    imagesChecked += imgCount;

    // SPA route sanity by clicking internal links and watching for 404
    const testLinks = links.slice(0, 20);
    for (const l of testLinks) {
      const [resp] = await Promise.all([
        page.waitForResponse(r => r.url().replace(/[#?].*$/, "") === l, { timeout: 15000 }).catch(() => null),
        page.evaluate(u => history.pushState({}, "", u), l),
        page.waitForLoadState("networkidle").catch(() => null),
      ]);
      if (resp && resp.status() === 404) {
        findings.push({ type: "route_404", from: url, to: l });
      }
    }
  }

  let pagesScanned = 0;

  const workers: Promise<void>[] = [];
  while (queue.length && pagesScanned < MAX_PAGES) {
    const u = queue.shift()!;
    if (seen.has(u)) continue;
    seen.add(u);
    pagesScanned++;

    workers.push(
      limit(async () => {
        await visit(u);
      }),
    );
  }
  await Promise.all(workers);

  // expand from collected links if under cap
  for (const l of allLinks) {
    if (pagesScanned >= MAX_PAGES) break;
    if (seen.has(l)) continue;
    if (inDisallow(l, disallow)) continue;
    seen.add(l);
    pagesScanned++;
    await visit(l);
  }

  linksTested = allLinks.size;

  await browser.close();

  const report: Report = {
    startedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    pagesScanned,
    linksTested,
    imagesChecked,
    findings,
    summary: {
      httpErrors: findings.filter(f => f.type === "http_error").length,
      brokenImages: findings.filter(f => f.type === "image_broken").length,
      hiddenImages: findings.filter(f => f.type === "image_hidden").length,
      overlays: findings.filter(f => f.type === "overlay_block").length,
      consoleErrors: findings.filter(f => f.type === "console_error").length,
      route404: findings.filter(f => f.type === "route_404").length,
      assetsMissing: findings.filter(f => f.type === "asset_missing").length,
    },
  };

  const outDir = path.join("audits");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "");
  const file = path.join(outDir, `site_audit_${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(report, null, 2), "utf8");

  const hardFail =
    report.summary.httpErrors > 0 ||
    report.summary.route404 > 0 ||
    report.summary.brokenImages > 0 ||
    report.summary.assetsMissing > 0;

  const softWarn =
    report.summary.hiddenImages > 0 ||
    report.summary.overlays > 0 ||
    report.summary.consoleErrors > 0;

  const badge = hardFail ? chalk.red("FAIL") : softWarn ? chalk.yellow("WARN") : chalk.green("PASS");
  console.log(badge, "pages", report.pagesScanned, "links", report.linksTested, "images", report.imagesChecked);
  console.log("report", file);

  if (hardFail) process.exit(2);
  if (softWarn && process.env.NODE_ENV === "ci") process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.SITE_URL) {
    console.error("Set SITE_URL to your deployed base url");
    process.exit(99);
  }
  crawl().catch(e => {
    console.error(e);
    process.exit(100);
  });
}
