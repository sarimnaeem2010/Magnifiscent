import { useEffect } from "react";

export interface UseSeoMetaProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  ogPriceAmount?: string;
  ogPriceCurrency?: string;
}

const DEFAULT_TITLE = "Buy Premium Perfumes Online in Pakistan | MagnifiScent";
const DEFAULT_DESCRIPTION =
  "Shop premium long-lasting Eau de Parfum for men and women in Pakistan. Free delivery & Cash on Delivery available. Authentic fragrances — MagnifiScent.";
const DEFAULT_OG_IMAGE = "";

let _globalTitle = DEFAULT_TITLE;
let _globalDesc = DEFAULT_DESCRIPTION;
let _globalOgImage = DEFAULT_OG_IMAGE;

export function syncGlobalSeo(title: string, desc: string, ogImage: string) {
  _globalTitle = title || DEFAULT_TITLE;
  _globalDesc = desc || DEFAULT_DESCRIPTION;
  _globalOgImage = ogImage || DEFAULT_OG_IMAGE;
}

function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeMetaTag(selector: string) {
  const el = document.querySelector(selector) as HTMLMetaElement | null;
  if (el) el.content = "";
}

export function applyDocumentMeta(
  title: string,
  desc: string,
  ogImage: string,
  ogType: string,
  ogPriceAmount?: string,
  ogPriceCurrency?: string,
) {
  document.title = title;
  setMetaTag('meta[name="description"]', "name", "description", desc);
  setMetaTag('meta[property="og:title"]', "property", "og:title", title);
  setMetaTag('meta[property="og:description"]', "property", "og:description", desc);
  setMetaTag('meta[property="og:type"]', "property", "og:type", ogType);
  setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);
  if (ogPriceAmount) {
    setMetaTag('meta[property="product:price:amount"]', "property", "product:price:amount", ogPriceAmount);
    setMetaTag(
      'meta[property="product:price:currency"]',
      "property",
      "product:price:currency",
      ogPriceCurrency || "PKR",
    );
  } else {
    removeMetaTag('meta[property="product:price:amount"]');
    removeMetaTag('meta[property="product:price:currency"]');
  }
}

export function useSeoMeta({
  title,
  description,
  ogImage = "",
  ogType = "website",
  ogPriceAmount,
  ogPriceCurrency,
}: UseSeoMetaProps) {
  useEffect(() => {
    applyDocumentMeta(title, description, ogImage, ogType, ogPriceAmount, ogPriceCurrency);

    return () => {
      applyDocumentMeta(_globalTitle, _globalDesc, _globalOgImage, "website");
    };
  }, [title, description, ogImage, ogType, ogPriceAmount, ogPriceCurrency]);
}
