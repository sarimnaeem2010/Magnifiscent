import chicImg from "@assets/image_1774960377576.png";
import darkAngelImg from "@assets/image_1774960421561.png";
import risingSunImg from "@assets/image_1774960455085.png";
import sigmaImg from "@assets/image_1774960467602.png";
import questImg from "@assets/image_1774960352441.png";

export type Product = {
  id: number;
  name: string;
  slug: string;
  img: string;
  img2: string;
  price: string;
  priceNum: number;
  originalPrice: string;
  originalPriceNum: number;
  reviews: number;
  rating: number;
  category: "men" | "women";
  desc: string;
  notes: string[];
  size: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "CHIC",
    slug: "chic",
    img: chicImg,
    img2: chicImg,
    price: "$89.00",
    priceNum: 89,
    originalPrice: "$110.00",
    originalPriceNum: 110,
    reviews: 42,
    rating: 5,
    category: "women",
    desc: "A warm floral fragrance with golden rose and soft jasmine notes, feminine and unforgettable. Perfect for the confident woman who embraces her femininity.",
    notes: ["Rose", "Jasmine", "Musk", "Vanilla"],
    size: "100ml / 3.4 Fl.oz",
  },
  {
    id: 2,
    name: "Dark Angel",
    slug: "dark-angel",
    img: darkAngelImg,
    img2: darkAngelImg,
    price: "$109.00",
    priceNum: 109,
    originalPrice: "$135.00",
    originalPriceNum: 135,
    reviews: 27,
    rating: 5,
    category: "women",
    desc: "Mysterious and exotic — black amber, oud and vanilla create an irresistible dark allure. For the woman who commands every room she enters.",
    notes: ["Black Amber", "Oud", "Vanilla", "Sandalwood"],
    size: "100ml / 3.4 Fl.oz",
  },
  {
    id: 3,
    name: "Rising Sun",
    slug: "rising-sun",
    img: risingSunImg,
    img2: risingSunImg,
    price: "$75.00",
    priceNum: 75,
    originalPrice: "$95.00",
    originalPriceNum: 95,
    reviews: 18,
    rating: 5,
    category: "women",
    desc: "Fresh citrus and green notes that feel like the first light of a new day. Bright, uplifting and effortlessly elegant.",
    notes: ["Bergamot", "Lemon", "Green Tea", "White Musk"],
    size: "100ml / 3.4 Fl.oz",
  },
  {
    id: 4,
    name: "SIGMA",
    slug: "sigma",
    img: sigmaImg,
    img2: sigmaImg,
    price: "$95.00",
    priceNum: 95,
    originalPrice: "$120.00",
    originalPriceNum: 120,
    reviews: 31,
    rating: 4,
    category: "women",
    desc: "Warm amber and spice in a bottle — a bold, long-lasting statement scent. For those who never go unnoticed.",
    notes: ["Amber", "Spice", "Patchouli", "Cedarwood"],
    size: "100ml / 3.4 Fl.oz",
  },
  {
    id: 5,
    name: "QUEST",
    slug: "quest",
    img: questImg,
    img2: questImg,
    price: "$89.00",
    priceNum: 89,
    originalPrice: "$115.00",
    originalPriceNum: 115,
    reviews: 54,
    rating: 5,
    category: "men",
    desc: "Bold and adventurous — deep blue aquatics and mountain freshness for the modern explorer. A signature scent for the man who lives boldly.",
    notes: ["Blue Aquatic", "Mountain Cedar", "Bergamot", "Ambroxan"],
    size: "100ml / 3.4 Fl.oz",
  },
  {
    id: 6,
    name: "NOIR",
    slug: "noir",
    img: "/noir-product.png",
    img2: "/noir-product.png",
    price: "$120.00",
    priceNum: 120,
    originalPrice: "$150.00",
    originalPriceNum: 150,
    reviews: 19,
    rating: 5,
    category: "men",
    desc: "A dark, smoky leather fragrance with notes of oud and black pepper. Intense and masculine, perfect for evening wear.",
    notes: ["Oud", "Black Pepper", "Leather", "Vetiver"],
    size: "100ml / 3.4 Fl.oz",
  },
  {
    id: 7,
    name: "STORM",
    slug: "storm",
    img: "/storm-product.png",
    img2: "/storm-product.png",
    price: "$85.00",
    priceNum: 85,
    originalPrice: "$105.00",
    originalPriceNum: 105,
    reviews: 22,
    rating: 5,
    category: "men",
    desc: "Cool, energetic aquatic notes with a cedarwood base — the scent of raw power. Made for those who take on every challenge.",
    notes: ["Sea Spray", "Cedarwood", "Grapefruit", "Musk"],
    size: "100ml / 3.4 Fl.oz",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getRelated = (product: Product) =>
  PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
