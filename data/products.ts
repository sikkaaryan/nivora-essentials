export type Audience = "Men" | "Women" | "Boy" | "Girl";
export type ProductRange = "Essential" | "Everyday" | "Premium" | "Luxury";
export type Product = {
  id: string; name: string; audience: Audience; type: string; range: ProductRange;
  price: number; sizes: string[]; tone: string; imageIndex: number;
};

export const products: Product[] = [
  {
    "id": "m-boxer-classic",
    "imageIndex": 0,
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
    "imageIndex": 1,
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
    "imageIndex": 2,
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
    "imageIndex": 3,
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
    "imageIndex": 4,
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
    "imageIndex": 5,
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
    "imageIndex": 6,
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
    "imageIndex": 7,
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
    "imageIndex": 8,
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
    "imageIndex": 9,
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
    "imageIndex": 10,
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
    "imageIndex": 11,
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
    "imageIndex": 12,
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
    "imageIndex": 13,
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
    "imageIndex": 14,
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
    "imageIndex": 15,
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
    "imageIndex": 16,
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
    "imageIndex": 17,
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
    "imageIndex": 18,
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
    "imageIndex": 19,
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
