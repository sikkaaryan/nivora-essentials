"use client";

import { useEffect, useMemo, useState } from "react";
import { products as previewProducts } from "@/data/products";
type CatalogMode = "retail" | "wholesale";
type CatalogProduct = Product & { wholesale_price?: number | null; min_quantity?: number | null };

type CartItem = { productId: string; size: string; quantity: number };
const audienceNames = ["All", "Men", "Women", "Boy", "Girl"];
const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"];
const rangeNames = ["All", "Essential", "Everyday", "Premium", "Luxury"];
const cartKeyFor = (mode: CatalogMode) => `nivora-cart-v1-${mode}`;

function ProductArtwork({ product }: { product: CatalogProduct }) {
  if (product.image_url) {
    return <div className="product-art product-real-photo"><img src={product.image_url} alt={product.name} loading="lazy" /></div>;
  }
  return <div className="product-art product-photo-missing"><span>PRODUCT PHOTO</span><small>COMING SOON</small></div>;
}
