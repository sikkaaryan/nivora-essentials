"use client";

import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";

const audienceNames = ["All","Men","Women","Boy","Girl"];
const allSizes = ["XS","S","M","L","XL","XXL","2-3Y","4-5Y","6-7Y","8-9Y","10-11Y"];
const rangeNames = ["All","Essential","Everyday","Premium"];

function ProductArtwork({ product }: { product: Product }) {
  const artwork = product.audience === "Men" ? "/products/men.svg" : product.audience === "Women" ? "/products/women.svg" : product.audience === "Boy" ? "/products/boy.svg" : "/products/girl.svg";
  return (
    <div className="product-art">
      <img src={artwork} alt={`${product.audience} ${product.type} collection artwork`} />
    </div>
  );
}

export function ProductCatalog() {
  const [audience,setAudience] = useState("All");
  const [type,setType] = useState("All");
  const [size,setSize] = useState("All");
  const [range,setRange] = useState("All");
  const [sort,setSort] = useState("featured");

  const types = useMemo(() => ["All", ...Array.from(new Set(products.filter(p => audience === "All" || p.audience === audience).map(p => p.type)))], [audience]);
  const filtered = useMemo(() => {
    const list = products.filter(p =>
      (audience === "All" || p.audience === audience) &&
      (type === "All" || p.type === type) &&
      (size === "All" || p.sizes.includes(size)) &&
      (range === "All" || p.range === range)
    );
    if (sort === "low") list.sort((a,b) => a.price-b.price);
    if (sort === "high") list.sort((a,b) => b.price-a.price);
    return list;
  }, [audience,type,size,range,sort]);

  function changeAudience(value: string) {
    setAudience(value); setType("All");
  }

  return (
    <section className="catalog-section" id="shop">
      <div className="catalog-heading">
        <div><div className="eyebrow">THE FIRST NIVORA EDIT</div><h2>Everyday, considered.</h2></div>
        <p>20 starting styles across four collections. Explore the range and find your fit.</p>
      </div>
      <div className="audience-tabs" aria-label="Shop by audience">
        {audienceNames.map(name => <button key={name} className={audience===name ? "active" : ""} onClick={() => changeAudience(name)}>{name === "All" ? "All" : name === "Boy" ? "Boys" : name === "Girl" ? "Girls" : name}</button>)}
      </div>
      <div className="catalog-layout">
        <aside className="filter-panel">
          <div className="filter-title"><span>REFINE BY</span><button onClick={() => {setAudience("All");setType("All");setSize("All");setRange("All");setSort("featured");}}>Reset</button></div>
          <label>For whom<select value={audience} onChange={e => changeAudience(e.target.value)}>{audienceNames.map(v=><option key={v} value={v}>{v==="All"?"Everyone":v==="Boy"?"Boys":v==="Girl"?"Girls":v}</option>)}</select></label>
          <label>Type<select value={type} onChange={e=>setType(e.target.value)}>{types.map(v=><option key={v}>{v}</option>)}</select></label>
          <label>Size<select value={size} onChange={e=>setSize(e.target.value)}><option>All</option>{allSizes.map(v=><option key={v}>{v}</option>)}</select></label>
          <label>Range<select value={range} onChange={e=>setRange(e.target.value)}>{rangeNames.map(v=><option key={v}>{v}</option>)}</select></label>
        </aside>
        <div className="catalog-results">
          <div className="results-bar"><span>{filtered.length} STYLES</span><label>Sort by <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
          {filtered.length ? <div className="product-grid">{filtered.map(product=><article className="product-card" key={product.id}>
            <ProductArtwork product={product}/>
            <div className="product-meta"><span>{product.audience.toUpperCase()} · {product.range.toUpperCase()}</span><span>₹{product.price.toLocaleString("en-IN")}</span></div>
            <h3>{product.name}</h3>
            <p>{product.type} <span>·</span> {product.sizes.join(" / ")}</p>
            <button className="quick-add" onClick={() => window.alert(`${product.name} — sample catalogue item. Shopping cart and size selection will be connected in the next phase.`)}>VIEW DETAILS <span>↗</span></button>
          </article>)}</div> : <div className="empty-results">No styles match these filters. Try another size or range.</div>}
        </div>
      </div>
      <p className="catalog-disclaimer">Launch collection preview · Product artwork, styles and INR prices are provisional examples and can be changed before launch.</p>
    </section>
  );
}
