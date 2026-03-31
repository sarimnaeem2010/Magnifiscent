import allureImg from "@assets/WhatsApp_Image_2026-03-31_at_6.28.41_PM_1774963774232.jpeg";
import chicImg from "@assets/b96aab17-baaf-4bc7-b557-0436698bc417_1774963774233.jpeg";
import darkAngelImg from "@assets/48a8c7e7-9133-4ab7-b823-bca1fa11fbd8_1774963774233.jpeg";
import risingSunImg from "@assets/24f4f0fb-44d5-4ce7-9983-163aded7840f_1774963774233.jpeg";
import sigmaImg from "@assets/28597e9e-7d4f-4eb6-860d-60c4692f509f_1774963774234.jpeg";
import questImg from "@assets/7053f792-dda5-4230-bbb5-258ac7ff5799_1774963774234.jpeg";

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
    price: "Rs. 89.00",
    priceNum: 89,
    originalPrice: "Rs. 110.00",
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
    price: "Rs. 109.00",
    priceNum: 109,
    originalPrice: "Rs. 135.00",
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
    price: "Rs. 75.00",
    priceNum: 75,
    originalPrice: "Rs. 95.00",
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
    price: "Rs. 95.00",
    priceNum: 95,
    originalPrice: "Rs. 120.00",
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
    price: "Rs. 89.00",
    priceNum: 89,
    originalPrice: "Rs. 115.00",
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
    name: "Allure",
    slug: "allure",
    img: allureImg,
    img2: allureImg,
    price: "Rs. 99.00",
    priceNum: 99,
    originalPrice: "Rs. 125.00",
    originalPriceNum: 125,
    reviews: 36,
    rating: 5,
    category: "women",
    desc: "A seductive and passionate fragrance — deep red roses, warm spice and a smouldering musk base. For the woman who captivates without trying.",
    notes: ["Red Rose", "Spice", "Musk", "Amber"],
    size: "100ml / 3.4 Fl.oz",
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getRelated = (product: Product) =>
  PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
