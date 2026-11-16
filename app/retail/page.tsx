import { ProductCatalog } from "@/components/product-catalog";
export const metadata = { title: "Retail — NIVORA ESSENTIALS", description: "Shop NIVORA everyday essentials." };
export default function RetailPage() { return <main><section className="route-hero"><div className="eyebrow">PERSONAL SHOPPING</div><h1>Your everyday.<br/><em>Reimagined.</em></h1><p>Explore comfort essentials for men, women, boys and girls.</p></section><ProductCatalog mode="retail"/></main>; }
