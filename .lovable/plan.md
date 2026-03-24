

# Plan: Add Blog Page, Improve Images, De-AI the Copy, and Wire Up Site Audit

## What This Covers

Three areas the user asked about:
1. **Add images** - Replace generic Unsplash stock photos with AI-fail-relevant images across the site
2. **Update blog / make it look less AI** - Build a Blog page using the existing `blog_articles` table, rewrite overly polished AI-sounding copy to be more casual/human
3. **Audit site** - Ensure the site audit functionality works end-to-end

---

## 1. Build Blog Page (`src/pages/Blog.tsx`)

The `blog_articles` and `blog_categories` tables already exist in Supabase. No blog page or components exist yet.

**Create:**
- `src/pages/Blog.tsx` - Main blog listing page fetching from `blog_articles` table (status = 'published'), with category filtering via `blog_categories`, card layout with cover images, reading time, excerpt
- `src/pages/BlogPost.tsx` - Individual article page fetching by slug, with view count increment, like button, related articles
- Add routes `/blog` and `/blog/:slug` to `App.tsx`
- Add "Blog" to Navbar and Footer navigation
- Seed 8-10 blog articles via SQL migration (topics: "Why AI hands are cursed", "Top 10 chatbot meltdowns of 2025", "The funniest DALL-E fails this month", etc.) - written in a casual, human voice

**Style:** Card grid layout, no fancy gradients or sparkle icons. Clean, Reddit/blog-like feel.

---

## 2. De-AI the Copy and Add Better Images

The current copy is peppered with AI-generated phrases. Changes across multiple files:

**Hero.tsx:**
- Change "When AI Goes Off the Rails" to something punchier like "AI Did What Now?"
- Rewrite subtext from the polished marketing speak to casual: "Sometimes AI nails it. Sometimes it draws hands with 9 fingers. We collect the second kind."
- Remove the abstract SVG blob animations (they look generic/AI-generated)

**FeaturedFails.tsx:**
- Change "The Most Epic AI Mishaps" to "Fresh Fails"
- Change "Our community's favorite AI failures that will make you laugh, cry, and question the future of technology." to "The latest and greatest screw-ups, voted by you."

**TrendingSection.tsx:**
- Change "Rising AI Disasters" to "Trending Right Now"
- Simplify the description

**QuickActions.tsx:**
- Remove the hardcoded fake stats (12.5K+ AI Fails, 84K+ Laughs) - these look dishonest on a new site
- Or replace with real counts from the database

**About.tsx:**
- Replace generic Unsplash tech stock photos with the droid logo or relevant AI fail screenshots
- Rewrite the overly polished mission statement to sound more human and direct
- Remove phrases like "we find joy in those moments" and "spectacularly wrong" (classic AI filler)

**sampleFails.ts:**
- Update image URLs to use more relevant/funny AI-themed images rather than generic Unsplash robot/code stock photos

---

## 3. Wire Up Site Audit

The `SiteAuditPanel` already calls the `website-audit` edge function. The edge function exists at `supabase/functions/website-audit/index.ts`. The `site_audits` table exists in Supabase.

**Verify/Fix:**
- Ensure the edge function is deployed (already configured in `config.toml`)
- The audit panel UI is already built and functional
- Add a "Run Audit" quick-link or notification on the Admin page if not already prominent

No major changes needed here - the audit infrastructure is already in place. The main gap was deploying edge functions (addressed in previous conversation).

---

## Files Changed

| File | Action |
|------|--------|
| `src/pages/Blog.tsx` | Create - blog listing page |
| `src/pages/BlogPost.tsx` | Create - individual article page |
| `src/App.tsx` | Edit - add blog routes |
| `src/components/Navbar.tsx` | Edit - add Blog link |
| `src/components/Footer.tsx` | Edit - add Blog link |
| `src/components/Hero.tsx` | Edit - rewrite copy, simplify visuals |
| `src/components/FeaturedFails.tsx` | Edit - rewrite headings |
| `src/components/TrendingSection.tsx` | Edit - rewrite headings |
| `src/components/QuickActions.tsx` | Edit - remove fake stats or use real data |
| `src/pages/About.tsx` | Edit - rewrite copy, swap images |
| `src/data/sampleFails.ts` | Edit - update image URLs |
| `supabase/migrations/seed_blog_articles.sql` | Create - seed blog content |

## Technical Details

- Blog queries use `supabase.from('blog_articles').select('*').eq('status', 'published')` 
- Blog post view tracking via existing `increment_blog_article_views` trigger
- Blog categories fetched from `blog_categories` table for filter sidebar
- All new copy written in first-person casual tone, no marketing speak

