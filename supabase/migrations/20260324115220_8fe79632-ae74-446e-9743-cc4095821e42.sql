
-- Seed blog categories
INSERT INTO public.blog_categories (name, slug, description, color, icon, display_order)
VALUES 
  ('Image Fails', 'image-fails', 'When AI draws things that should not exist', '#ef4444', '🖼️', 1),
  ('Chat Fails', 'chat-fails', 'Chatbots saying the wildest stuff', '#3b82f6', '💬', 2),
  ('Code Fails', 'code-fails', 'AI code that breaks everything', '#8b5cf6', '💻', 3),
  ('Voice Fails', 'voice-fails', 'Voice assistants gone wrong', '#f59e0b', '🎤', 4),
  ('Roundups', 'roundups', 'Best-of collections and lists', '#10b981', '📋', 5)
ON CONFLICT DO NOTHING;

-- Seed blog articles
INSERT INTO public.blog_articles (title, slug, excerpt, content, author_name, status, category, tags, reading_time_minutes, cover_image_url, published_at, featured)
VALUES 
(
  'Why AI Hands Are Cursed (And Always Will Be)',
  'why-ai-hands-are-cursed',
  'Six fingers, melted thumbs, and knuckles where knuckles shouldn''t be. Let''s talk about it.',
  '<p>If you''ve spent any time looking at AI-generated images, you''ve noticed the hands. They''re bad. They''re always bad. Sometimes there are too many fingers. Sometimes the fingers bend the wrong way. Sometimes there are no fingers at all, just a flesh-colored blob where a hand should be.</p><p>Why does this keep happening? The short answer: hands are hard. They have 27 bones, they can fold in countless configurations, and they''re in a huge percentage of photos — but rarely the focus. So the AI sees thousands of examples but never really <em>learns</em> hands.</p><p>DALL-E 3 and Midjourney v6 have gotten better, but "better" is relative. We went from cosmic horror hands to merely unsettling hands. Progress?</p><p>The community has even started rating hand quality as a benchmark for new models. If your AI can draw a hand holding a coffee cup without creating an eldritch appendage, you''re doing something right.</p>',
  'AI Oopsies Team',
  'published',
  'Image Fails',
  ARRAY['hands', 'image-generation', 'dall-e', 'midjourney'],
  3,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '2 days',
  true
),
(
  'Top 10 Chatbot Meltdowns of 2025 (So Far)',
  'top-10-chatbot-meltdowns-2025',
  'From existential crises to aggressive recipe suggestions, chatbots had a rough year.',
  '<p>It''s only March and chatbots have already given us enough material for a full highlight reel. Here are the best ones we''ve seen:</p><ol><li><strong>The therapist bot that told someone to "just deal with it"</strong> — Not exactly the warm empathy we were promised.</li><li><strong>Customer service bot that apologized 47 times in one message</strong> — We counted.</li><li><strong>The cooking assistant that suggested adding "a pinch of sand"</strong> — For texture, apparently.</li><li><strong>GPT confidently explaining a historical event that never happened</strong> — The Battle of Westlake, 1847. Totally made up.</li><li><strong>Chatbot that refused to answer because "it''s lunchtime"</strong> — Boundaries, we guess?</li></ol><p>We''ll keep updating this list. At this rate, we''ll need a top 50.</p>',
  'AI Oopsies Team',
  'published',
  'Chat Fails',
  ARRAY['chatbot', 'gpt', 'hallucination', 'roundup'],
  4,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '5 days',
  true
),
(
  'That Time an AI Wrote Code That Deleted Itself',
  'ai-code-that-deleted-itself',
  'A coding assistant generated a script so bad it literally removed its own files.',
  '<p>Someone asked their AI coding assistant to "clean up the project directory." The AI interpreted this creatively and wrote a script that deleted every file in the project, including itself.</p><p>The user posted the terminal output on our community page and it immediately went viral. The sequence of commands was almost poetic in its destructiveness — methodically removing files one by one until there was nothing left.</p><p>Lesson learned: always read the code before you run it. Especially when the AI is being "helpful."</p>',
  'AI Oopsies Team',
  'published',
  'Code Fails',
  ARRAY['coding', 'copilot', 'disaster', 'files'],
  2,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '8 days',
  false
),
(
  'Voice Assistants vs Pets: An Ongoing War',
  'voice-assistants-vs-pets',
  'Your dog barks, your smart speaker orders 50 pounds of kibble. A love story.',
  '<p>We''ve gotten dozens of submissions about voice assistants responding to pets instead of their owners. The results range from funny to expensive.</p><p>Highlights include:</p><ul><li>A parrot that learned to say "Hey Siri" and now controls the lights</li><li>A dog whose bark was interpreted as "play heavy metal" at 3 AM</li><li>A cat walking across a keyboard that somehow ordered $200 worth of cat toys (okay, maybe the cat knew what it was doing)</li></ul><p>If you have a pet and a voice assistant, you basically have two chaotic entities competing for control of your house. And honestly? The pet usually wins.</p>',
  'AI Oopsies Team',
  'published',
  'Voice Fails',
  ARRAY['voice-assistant', 'pets', 'siri', 'alexa'],
  3,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '12 days',
  false
),
(
  'The Funniest DALL-E Fails This Month',
  'funniest-dall-e-fails-march-2025',
  'Dogs with human teeth, buildings made of spaghetti, and a horse that''s also a bicycle.',
  '<p>Every month we round up the best (worst?) image generation fails from our community. March did not disappoint.</p><p>The standouts this time: someone asked for "a dog at a business meeting" and got a dog with disturbingly human teeth in a suit. Another user requested "a house made of natural materials" and received what can only be described as a building constructed entirely from spaghetti.</p><p>And then there was the horse-bicycle hybrid. Nobody asked for it. Nobody wanted it. But here we are, and we can''t stop looking at it.</p><p>Keep submitting your finds — the weirder, the better.</p>',
  'AI Oopsies Team',
  'published',
  'Roundups',
  ARRAY['dall-e', 'image-generation', 'monthly-roundup'],
  3,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '1 day',
  true
),
(
  'When AI Translation Goes Completely Off the Rails',
  'ai-translation-fails',
  'From business emails in Klingon to menu items that threaten customers.',
  '<p>Machine translation has come a long way. But "a long way" still leaves room for some spectacular misses.</p><p>Our favorite recent example: a restaurant that used AI to translate their menu into English and ended up with dishes like "Exploding Chicken of Rage" and "The Forbidden Soup (do not eat)." The restaurant kept the translations because they became a tourist attraction.</p><p>Then there''s the business executive who auto-translated an email to a Japanese client and accidentally proposed marriage. Twice. In the same email.</p><p>The takeaway: always, always have a human review your translations. Unless you want your restaurant to become famous for all the wrong reasons.</p>',
  'AI Oopsies Team',
  'published',
  'Chat Fails',
  ARRAY['translation', 'language', 'business', 'food'],
  3,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '15 days',
  false
),
(
  'AI Art Judges: When the Algorithm Has No Taste',
  'ai-art-judges-no-taste',
  'An AI rated a masterpiece painting 2/10 and a blurry photo of a sandwich 9/10.',
  '<p>Someone built an AI art critic and let it loose on famous paintings. The results were... educational.</p><p>The Mona Lisa? "Composition is acceptable but the subject appears bored. 4/10." Starry Night? "Too many swirls. The artist should consider a steadier hand. 3/10." A blurry phone photo of a ham sandwich? "Excellent use of negative space and warm tones. 9/10."</p><p>This tells us everything we need to know about AI understanding art. Which is to say: it doesn''t. But at least it''s confident about it.</p>',
  'AI Oopsies Team',
  'published',
  'Image Fails',
  ARRAY['art', 'rating', 'vision', 'humor'],
  2,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '20 days',
  false
),
(
  'How to Spot AI-Generated Nonsense (A Practical Guide)',
  'how-to-spot-ai-nonsense',
  'Red flags that scream "a robot wrote this" — and why it matters.',
  '<p>After running this site for a while, we''ve gotten pretty good at spotting AI-generated content. Here are the telltale signs:</p><ul><li><strong>Overly confident about made-up facts</strong> — If it states something incredibly specific with zero hedging, double-check it.</li><li><strong>Perfect grammar, zero personality</strong> — Real humans make typos and have opinions. AI writes like a very polite textbook.</li><li><strong>The word "delve"</strong> — Seriously, if you see "delve" in anything, there''s a 90% chance AI wrote it.</li><li><strong>Suspiciously balanced perspectives</strong> — "On one hand... on the other hand..." repeated five times is a dead giveaway.</li><li><strong>Lists of exactly 5 or 10 items</strong> — AI loves round numbers. (Yes, we see the irony in this list.)</li></ul><p>None of this is bad per se — but it''s worth knowing when you''re reading something a human actually wrote vs. something that was generated. Especially when it''s supposed to be a restaurant review or a product recommendation.</p>',
  'AI Oopsies Team',
  'published',
  'Roundups',
  ARRAY['detection', 'guide', 'writing', 'tips'],
  4,
  'https://lzfgigiyqpuuxslsygjt.supabase.co/storage/v1/object/public/images/AHC%20droid%20head.webp',
  now() - interval '25 days',
  false
)
ON CONFLICT DO NOTHING;
