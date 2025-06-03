import { Product } from '../components/shop/ProductCard';

export const mockProducts: Product[] = [
  {
    id: 'price_tshirt1',
    name: "404: Brain Not Found T-Shirt",
    description: "Inspired by classic AI error messages. Soft cotton blend with a relaxed fit.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1583744946564-b52d01e7f922?q=80&w=1974&auto=format&fit=crop",
    category: "T-Shirts",
    featured: true,
    variants: [
      { size: "S", color: "Black" },
      { size: "M", color: "Black" },
      { size: "L", color: "Black" },
      { size: "XL", color: "Black" }
    ]
  },
  {
    id: 'price_tshirt2',
    name: "Powered by Artificial Stupidity T-Shirt",
    description: "For when AI isn't quite intelligent yet. Premium cotton with vintage print.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2069&auto=format&fit=crop",
    category: "T-Shirts"
  },
  {
    id: 'price_tshirt3',
    name: "My Code is Abstract Art T-Shirt",
    description: "Celebrate the beautiful chaos of debugging AI. Lightweight and breathable.",
    price: 23.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
    category: "T-Shirts"
  },
  {
    id: 'price_hoodie1',
    name: "Neural Network Meltdown Hoodie",
    description: "Stay warm while your AI freezes. Heavy-duty fleece with front pocket.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1964&auto=format&fit=crop",
    category: "Hoodies"
  },
  {
    id: 'price_mug1',
    name: "AI Hallucinations Mug",
    description: "Enjoy your coffee with a side of AI-generated absurdity. Ceramic, dishwasher safe.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1974&auto=format&fit=crop",
    category: "Mugs"
  },
  {
    id: 'price_sticker1',
    name: "Syntax Error Sticker Pack",
    description: "Decorate your laptop with these coding mishaps. Waterproof vinyl.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1618424181497-157f55ca8931?q=80&w=1925&auto=format&fit=crop",
    category: "Stickers"
  },
  {
    id: 'price_poster1',
    name: "The AI is Always Watching Poster",
    description: "A humorous take on AI surveillance. High-quality print.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=2070&auto=format&fit=crop",
    category: "Posters"
  },
  {
    id: 'price_keychain1',
    name: "AI Fails Collectible Keychain",
    description: "Show your love for AI fails with this durable keychain.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1505664194779-8be206e3a33f?q=80&w=2070&auto=format&fit=crop",
    category: "Keychains"
  }
];
