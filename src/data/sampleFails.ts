
export interface AIFail {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  username: string;
  date: string;
  likes: number;
  featured: boolean;
  category?: string;
  comments?: number;
  tags?: string[];
  aiModel?: string;
}

export const sampleFails: AIFail[] = [
  {
    id: "fail-001",
    title: "ChatGPT thinks I'm a time traveler",
    description: "I asked for current events and it gave me 'predictions' from 2019!",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjByb2JvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    username: "TimeTravelerNot",
    date: "2023-11-15",
    likes: 128,
    featured: true,
    category: "Chat",
    comments: 24,
    tags: ["hallucination", "time-confusion", "ChatGPT"],
    aiModel: "GPT-3.5"
  },
  {
    id: "fail-002",
    title: "AI generated an extra finger",
    description: "Asked for a hand holding a phone, got a mutant hand instead!",
    imageUrl: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjByb2JvdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    username: "ExtraDigits",
    date: "2023-11-22",
    likes: 256,
    featured: true,
    category: "Image",
    comments: 42,
    tags: ["body-horror", "extra-limbs", "midjourney"],
    aiModel: "Midjourney v5"
  },
  {
    id: "fail-003",
    title: "Weather bot thinks I live underwater",
    description: "Asked for the weather, was told to watch out for strong currents and sharks!",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHdlYXRoZXIlMjB1bmRlcndhdGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    username: "NotAMermaid",
    date: "2023-12-01",
    likes: 84,
    featured: true,
    category: "Chat",
    comments: 18,
    tags: ["confusion", "weather", "location-error"],
    aiModel: "Custom Weather Bot"
  },
  {
    id: "fail-004",
    title: "AI thinks my cat is a rare species of penguin",
    description: "Uploaded a picture of my tabby cat, and the AI confidently identified it as an 'endangered Antarctic yellow-crested penguin'",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    username: "CatPerson123",
    date: "2023-12-10",
    likes: 312,
    featured: true,
    category: "Vision",
    comments: 53,
    tags: ["animal-recognition", "hallucination", "classification"],
    aiModel: "GPT-4 Vision"
  },
  {
    id: "fail-005",
    title: "Recipe AI suggested I cook chicken for 12 hours",
    description: "Asked for a simple chicken recipe, got instructions that would turn it into charcoal!",
    imageUrl: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMGJ1cm50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    username: "NotAChef",
    date: "2023-12-15",
    likes: 178,
    featured: false,
    category: "Cooking",
    comments: 36,
    tags: ["recipe", "cooking-disaster", "bad-instructions"],
    aiModel: "CulinaryGPT"
  },
  {
    id: "fail-006",
    title: "AI created a 'horse' with wheels instead of legs",
    description: "I asked for an image of a horse running through a field. The AI gave me some kind of horse-car hybrid!",
    imageUrl: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG9yc2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    username: "HorseLover",
    date: "2024-01-05",
    likes: 226,
    featured: false,
    category: "Image",
    comments: 45,
    tags: ["hybrid-creature", "dall-e", "strange-anatomy"],
    aiModel: "DALL-E 3"
  },
  {
    id: "fail-007",
    title: "Coding assistant created infinite loop",
    description: "Asked for help with a simple algorithm, got code that crashed my browser!",
    imageUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29kZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    username: "CodeCrashTester",
    date: "2024-01-10",
    likes: 142,
    featured: false,
    category: "Code",
    comments: 32,
    tags: ["coding", "infinite-loop", "browser-crash"],
    aiModel: "CodePilot"
  },
  {
    id: "fail-008",
    title: "AI translated my email into Klingon",
    description: "Used an AI translator for a business email, accidentally sent my boss a message in Klingon!",
    imageUrl: "https://images.unsplash.com/photo-1526554850534-7c78330d5f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZW1haWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    username: "NotATrekkie",
    date: "2024-01-20",
    likes: 97,
    featured: false,
    category: "Translation",
    comments: 22,
    tags: ["language", "translation", "klingon", "email"],
    aiModel: "TranslateAI"
  },
  {
    id: "fail-009",
    title: "AI thought my selfie was an abstract painting",
    description: "Uploaded a selfie to an AI art analyzer, it called it 'a post-modern cubist masterpiece'",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VsZmllJTIwYWJzdHJhY3R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    username: "NotAPainting",
    date: "2024-02-01",
    likes: 156,
    featured: false,
    category: "Vision",
    comments: 28,
    tags: ["art", "selfie", "misidentification"],
    aiModel: "ArtClassifierAI"
  },
  {
    id: "fail-010",
    title: "Voice assistant kept hearing my cat instead of me",
    description: "Every time I asked to set a timer, it responded to my cat's meows and set completely random alarms",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    username: "CatWhisperer",
    date: "2024-02-15",
    likes: 183,
    featured: false,
    category: "Voice",
    comments: 39,
    tags: ["voice-recognition", "pets", "false-positive"],
    aiModel: "HomeAssistant"
  }
];

export function getFeaturedFails(): AIFail[] {
  return sampleFails.filter(fail => fail.featured);
}

export function getAllFails(): AIFail[] {
  return [...sampleFails].sort((a, b) => b.likes - a.likes);
}

export function getFailsByCategory(category: string): AIFail[] {
  return sampleFails.filter(fail => fail.category === category);
}

export function getTopTags(): string[] {
  const tagCounts = new Map<string, number>();
  
  sampleFails.forEach(fail => {
    fail.tags?.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
}
