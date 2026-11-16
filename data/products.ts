export type Audience = "Men" | "Women" | "Boy" | "Girl";
export type ProductRange = "Essential" | "Everyday" | "Premium" | "Luxury";
export type Product = {
  id: string; name: string; audience: Audience; type: string; range: ProductRange;
  price: number; sizes: string[]; tone: string;
};

export const products: Product[] = [
  {
    "id": "m-boxer-classic",
    "name": "Classic Cotton Boxer",
    "audience": "Men",
    "type": "Boxers",
    "range": "Everyday",
    "price": 1199,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tone": "Stone"
  },
  {
    "id": "m-trunk-flex",
    "name": "Flex Fit Trunks",
    "audience": "Men",
    "type": "Trunks",
    "range": "Premium",
    "price": 2199,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tone": "Midnight"
  },
  {
    "id": "m-brief-core",
    "name": "Core Cotton Briefs",
    "audience": "Men",
    "type": "Briefs",
    "range": "Essential",
    "price": 799,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tone": "Black"
  },
  {
    "id": "m-vest-rib",
    "name": "Ribbed Everyday Vest",
    "audience": "Men",
    "type": "Vests",
    "range": "Essential",
    "price": 999,
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tone": "Ivory"
  },
  {
    "id": "m-tee-soft",
    "name": "Soft Touch Crew Tee",
    "audience": "Men",
    "type": "T-shirts",
    "range": "Luxury",
    "price": 3499,
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "tone": "Graphite"
  },
  {
    "id": "w-bra-seamless",
    "name": "Seamless Comfort Bra",
    "audience": "Women",
    "type": "Bras",
    "range": "Luxury",
    "price": 3999,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tone": "Sand"
  },
  {
    "id": "w-panty-cotton",
    "name": "Cotton Everyday Brief",
    "audience": "Women",
    "type": "Briefs",
    "range": "Essential",
    "price": 699,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "tone": "Rose"
  },
  {
    "id": "w-cami-layer",
    "name": "Soft Layer Camisole",
    "audience": "Women",
    "type": "Camisoles",
    "range": "Everyday",
    "price": 1299,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tone": "Ivory"
  },
  {
    "id": "w-boyshort",
    "name": "Smooth Fit Boyshort",
    "audience": "Women",
    "type": "Boyshorts",
    "range": "Everyday",
    "price": 999,
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "tone": "Mocha"
  },
  {
    "id": "w-lounge-set",
    "name": "Relaxed Lounge Set",
    "audience": "Women",
    "type": "Lounge sets",
    "range": "Luxury",
    "price": 4999,
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "tone": "Olive"
  },
  {
    "id": "b-trunk-play",
    "name": "Playday Cotton Trunks",
    "audience": "Boy",
    "type": "Trunks",
    "range": "Everyday",
    "price": 899,
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "tone": "Blue"
  },
  {
    "id": "b-brief-core",
    "name": "Little Core Briefs",
    "audience": "Boy",
    "type": "Briefs",
    "range": "Essential",
    "price": 599,
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y"
    ],
    "tone": "Navy"
  },
  {
    "id": "b-vest-soft",
    "name": "Soft Cotton Vest",
    "audience": "Boy",
    "type": "Vests",
    "range": "Essential",
    "price": 799,
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "tone": "White"
  },
  {
    "id": "b-tee-weekend",
    "name": "Weekend Crew Tee",
    "audience": "Boy",
    "type": "T-shirts",
    "range": "Premium",
    "price": 1699,
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "tone": "Sage"
  },
  {
    "id": "b-set-active",
    "name": "Active Day Set",
    "audience": "Boy",
    "type": "Sets",
    "range": "Premium",
    "price": 1999,
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y"
    ],
    "tone": "Charcoal"
  },
  {
    "id": "g-brief-cotton",
    "name": "Cotton Comfort Briefs",
    "audience": "Girl",
    "type": "Briefs",
    "range": "Essential",
    "price": 599,
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "tone": "Blush"
  },
  {
    "id": "g-cami-soft",
    "name": "Soft Cotton Camisole",
    "audience": "Girl",
    "type": "Camisoles",
    "range": "Everyday",
    "price": 899,
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "tone": "Ivory"
  },
  {
    "id": "g-shortie",
    "name": "Everyday Shorties",
    "audience": "Girl",
    "type": "Shorties",
    "range": "Everyday",
    "price": 799,
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y"
    ],
    "tone": "Lilac"
  },
  {
    "id": "g-tee-play",
    "name": "Playful Essential Tee",
    "audience": "Girl",
    "type": "T-shirts",
    "range": "Premium",
    "price": 1599,
    "sizes": [
      "4-5Y",
      "6-7Y",
      "8-9Y",
      "10-11Y"
    ],
    "tone": "Peach"
  },
  {
    "id": "g-set-comfy",
    "name": "Comfy Day Set",
    "audience": "Girl",
    "type": "Sets",
    "range": "Luxury",
    "price": 2999,
    "sizes": [
      "2-3Y",
      "4-5Y",
      "6-7Y",
      "8-9Y"
    ],
    "tone": "Berry"
  }
];

export const audienceOptions = ["All","Men","Women","Boy","Girl"] as const;
export const rangeOptions = ["All","Essential","Everyday","Premium","Luxury"] as const;
