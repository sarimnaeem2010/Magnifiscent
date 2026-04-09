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

export const PRODUCTS: Product[] = [];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getRelated = (product: Product) =>
  PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
