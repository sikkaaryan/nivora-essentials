"use client";

import { useEffect, useMemo, useState } from "react";
import { products as previewProducts, type Product } from "@/data/products";
type CatalogMode = "retail" | "wholesale";
type CatalogProduct = Product & { image_url?: string | null; wholesale_price?: number | null; min_quantity?: number | null };

type CartItem = { productId: string; size: string; quantity: number };
const audienceNames = ["All", "Men", "Women", "Boy", "Girl"];
const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"];
const rangeNames = ["All", "Essential", "Everyday", "Premium", "Luxury"];
const cartKeyFor = (mode: CatalogMode) => `nivora-cart-v1-${mode}`;

function ProductArtwork({ product }: { product: CatalogProduct }) {
  const tone = ({ Stone: "#77736e", Midnight: "#202a3b", Black: "#222222", Ivory: "#eee7d8", Graphite: "#414348", Sand: "#c7aa8d", Rose: "#c98f91", Mocha: "#80675d", Teal: "#245c60", Navy: "#283b58", White: "#e9e5dc", Blue: "#718da8", Slate: "#66717e", Blush: "#e5b2ad", Lilac: "#c7b4d7", Lavender: "#aa96c5", Mint: "#d3dfcb", Peach: "#e7ad9d" } as Record<string, string>)[product.tone] ?? "#b8a99b";
  const type = product.type.toLowerCase();
  const isBra = type.includes("bra");
  const isBrief = type.includes("brief") || type.includes("panty") || type.includes("boyshort");
  const isBottom = type.includes("boxer") || type.includes("trunk") || type.includes("short");
  const isTank = type.includes("vest") || type.includes("cami");
  const isSet = type.includes("set");
  const isTee = type.includes("tee") || type.includes("t-shirt") || type.includes("shirt") || isSet;
  return <div className="product-art product-illustration" role="img" aria-label={product.name}>
    {product.image_url && <img src={product.image_url} alt={product.name} loading="lazy" onError={event => { event.currentTarget.style.display = "none"; }} />}
    <svg viewBox="0 0 320 260" aria-hidden="true" focusable="false">
      <ellipse cx="160" cy="224" rx="92" ry="12" fill="#b8a99b" opacity=".16" />
      {isBra ? <g fill={tone} stroke="#5c5149" strokeOpacity=".22" strokeWidth="2"><path d="M67 143 Q70 85 118 96 Q148 102 158 151 Q169 102 202 96 Q250 85 253 143 L232 178 Q208 193 177 169 L160 158 L143 169 Q112 193 88 178Z"/><path d="M111 99 Q105 54 121 43 M209 99 Q215 54 199 43" fill="none" stroke={tone} strokeWidth="10" strokeLinecap="round"/><path d="M67 143 Q160 168 253 143" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3"/></g>
      : isBrief ? <g fill={tone} stroke="#5c5149" strokeOpacity=".22" strokeWidth="2"><path d="M77 92 Q160 105 243 92 L226 179 Q212 204 183 183 L160 159 L137 183 Q108 204 94 179Z"/><path d="M77 92 Q160 110 243 92" fill="none" stroke="#fff" strokeOpacity=".32" strokeWidth="5"/></g>
      : isBottom ? <g fill={tone} stroke="#5c5149" strokeOpacity=".22" strokeWidth="2"><path d="M76 83 Q160 98 244 83 L230 188 Q215 203 176 194 L160 129 L144 194 Q105 203 90 188Z"/><path d="M76 83 Q160 100 244 83" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="5"/><path d="M160 127 L160 190" fill="none" stroke="#5c5149" strokeOpacity=".22" strokeWidth="2"/></g>
      : isTank ? <g fill={tone} stroke="#5c5149" strokeOpacity=".2" strokeWidth="2"><path d="M112 45 L135 45 L144 76 L176 76 L185 45 L208 45 L236 93 L218 110 L211 205 L109 205 L102 110 L84 93Z"/><path d="M135 45 Q160 95 185 45" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth="4"/></g>
      : isTee ? <g fill={tone} stroke="#5c5149" strokeOpacity=".2" strokeWidth="2"><path d="M112 48 L139 37 Q160 56 181 37 L208 48 L253 87 L228 119 L208 105 L211 207 L109 207 L112 105 L92 119 L67 87Z"/><path d="M139 38 Q160 75 181 38" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="4"/></g>
      : <g fill={tone} stroke="#5c5149" strokeOpacity=".2" strokeWidth="2"><path d="M96 57 L224 57 L238 195 L82 195Z"/><path d="M96 57 Q160 72 224 57" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="4"/></g>}
      <path d="M125 75 Q160 86 195 75" fill="none" stroke="#fff" strokeOpacity=".13" strokeWidth="2"/>
    </svg>
  </div>;
}

export function ProductCatalog({ mode = "retail" }: { mode?: CatalogMode }) {
  const cartKey = cartKeyFor(mode);
  const [products, setProducts] = useState<CatalogProduct[]>(previewProducts);
  const [audience, setAudience] = useState("All");
  const [type, setType] = useState("All");
  const [size, setSize] = useState("All");
  const [range, setRange] = useState("All");
  const [sort, setSort] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/products").then(response => response.ok ? response.json() : null).then(data => { if (mounted && Array.isArray(data?.products)) setProducts(data.products); }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(cartKey);
      if (saved) setCart(JSON.parse(saved) as CartItem[]);
    } catch { /* Ignore invalid local cart data. */ }
    setReady(true);
  }, [cartKey]);

  useEffect(() => {
    if (ready) localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, ready, cartKey]);

  const types = useMemo(() => ["All", ...Array.from(new Set(products.filter(p => audience === "All" || p.audience === audience).map(p => p.type)))], [audience, products]);
  const filtered = useMemo(() => {
    const list = products.filter(p =>
      (audience === "All" || p.audience === audience) &&
      (type === "All" || p.type === type) &&
      (size === "All" || p.sizes.includes(size)) &&
      (range === "All" || p.range === range)
    );
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [audience, type, size, range, sort, products]);

  const displayPrice = (product: CatalogProduct) => mode === "wholesale" ? (product.wholesale_price || Math.round(product.price * 0.7)) : product.price;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? displayPrice(product) : 0) * item.quantity;
  }, 0);

  function changeAudience(value: string) { setAudience(value); setType("All"); }
  function openProduct(product: CatalogProduct) {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] ?? "");
    setQuantity(mode === "wholesale" ? Number((product as CatalogProduct).min_quantity || 25) : 1);
    setNotice("");
  }
  function addItem(product: CatalogProduct, itemSize: string, itemQuantity: number) {
    if (!itemSize || !Number.isInteger(itemQuantity) || itemQuantity < 1) return;
    setCart(current => {
      const existing = current.find(item => item.productId === product.id && item.size === itemSize);
      return existing
        ? current.map(item => item.productId === product.id && item.size === itemSize ? { ...item, quantity: item.quantity + itemQuantity } : item)
        : [...current, { productId: product.id, size: itemSize, quantity: itemQuantity }];
    });
    setNotice(`${product.name} added to your bag`);
    setCartOpen(true);
  }
  function addToCart() {
    if (!selectedProduct || !selectedSize) return;
    addItem(selectedProduct, selectedSize, quantity);
    setSelectedProduct(null);
  }
  function updateQuantity(productId: string, itemSize: string, next: number) {
    setCart(current => next <= 0
      ? current.filter(item => !(item.productId === productId && item.size === itemSize))
      : current.map(item => item.productId === productId && item.size === itemSize ? { ...item, quantity: next } : item));
  }

  return (
    <section className="catalog-section" id="shop">
      <div className="catalog-heading">
        <div><div className="eyebrow">THE FIRST NIVORA EDIT</div><h2>Everyday, considered.</h2></div>
        <p>20 curated styles across four collections, with considered luxury pricing. Explore the range and find your fit.</p>
      </div>
      <div className="catalog-toolbar">
        <div className="audience-tabs" aria-label="Shop by audience">
          {audienceNames.map(name => <button key={name} className={audience === name ? "active" : ""} onClick={() => changeAudience(name)}>{name === "All" ? "All" : name === "Boy" ? "Boys" : name === "Girl" ? "Girls" : name}</button>)}
        </div>
        <button className="bag-control" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${cartCount} items`}>BAG ({cartCount}) ↗</button>
      </div>
      {notice && <p className="cart-notice" role="status">{notice}</p>}
      <div className="catalog-layout">
        <aside className="filter-panel">
          <div className="filter-title"><span>REFINE BY</span><button onClick={() => { setAudience("All"); setType("All"); setSize("All"); setRange("All"); setSort("featured"); }}>Reset</button></div>
          <label>For whom<select value={audience} onChange={e => changeAudience(e.target.value)}>{audienceNames.map(v => <option key={v} value={v}>{v === "All" ? "Everyone" : v === "Boy" ? "Boys" : v === "Girl" ? "Girls" : v}</option>)}</select></label>
          <label>Type<select value={type} onChange={e => setType(e.target.value)}>{types.map(v => <option key={v}>{v}</option>)}</select></label>
          <label>Size<select value={size} onChange={e => setSize(e.target.value)}><option>All</option>{allSizes.map(v => <option key={v}>{v}</option>)}</select></label>
          <label>Range<select value={range} onChange={e => setRange(e.target.value)}>{rangeNames.map(v => <option key={v}>{v}</option>)}</select></label>
        </aside>
        <div className="catalog-results">
          <div className="results-bar"><span>{filtered.length} STYLES</span><label>Sort by <select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div>
          {filtered.length ? <div className="product-grid">{filtered.map(product => <article className="product-card" key={product.id}>
            <ProductArtwork product={product} />
            <div className="product-meta"><span>{product.audience.toUpperCase()} · {product.range.toUpperCase()}</span><span>₹{displayPrice(product).toLocaleString("en-IN")}</span></div>
            <h3>{product.name}</h3>
            <p>{product.type} <span>·</span> {product.sizes.join(" / ")}</p>{mode === "wholesale" && <p>Minimum {Number(product.min_quantity || 25)} units · 30% trade saving</p>}
            <div className="product-card-actions"><button className="quick-add" onClick={() => openProduct(product)}>VIEW DETAILS <span>↗</span></button><button className="quick-add" onClick={() => addItem(product, product.sizes[0] ?? "", mode === "wholesale" ? Number(product.min_quantity || 25) : 1)}>ADD TO BAG <span>＋</span></button></div>
          </article>)}</div> : <div className="empty-results">No styles match these filters. Try another size or range.</div>}
        </div>
      </div>
      <p className="catalog-disclaimer">{mode === "wholesale" ? "Wholesale prices are 30% below retail. Each style has its own minimum order quantity, shown on the product details." : "Collection preview · Product artwork, styles and INR prices are provisional and can be updated before launch."}</p>

      {selectedProduct && <div className="store-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
        <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
          <button className="dialog-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details">×</button>
          <ProductArtwork product={selectedProduct} />
          <div className="dialog-copy">
            <div className="eyebrow">{selectedProduct.audience} · {selectedProduct.range}</div>
            <h2 id="product-dialog-title">{selectedProduct.name}</h2>
            <div className="dialog-price">₹{displayPrice(selectedProduct).toLocaleString("en-IN")}</div>
            <p className="dialog-description">{selectedProduct.type} · {selectedProduct.tone} · Thoughtfully considered everyday comfort.</p>
            <label className="choice-label">SELECT SIZE</label>
            <div className="size-choices">{selectedProduct.sizes.map(s => <button key={s} className={selectedSize === s ? "selected" : ""} onClick={() => setSelectedSize(s)}>{s}</button>)}</div>
            <span className="choice-label">QUANTITY {mode === "wholesale" ? `(MIN ${Number((selectedProduct as CatalogProduct).min_quantity || 25)})` : ""}</span>
            <div className="quantity-control"><button onClick={() => setQuantity(q => Math.max(mode === "wholesale" ? Number((selectedProduct as CatalogProduct).min_quantity || 25) : 1, q - 1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button onClick={() => setQuantity(q => Math.min(500, q + 1))} aria-label="Increase quantity">+</button></div>
            <button className="add-to-bag" onClick={addToCart}>ADD TO BAG — ₹{(displayPrice(selectedProduct) * quantity).toLocaleString("en-IN")}</button>
            <p className="provisional-note">Preview product · Final images, fabric details and stock confirmation will be added before launch.</p>
          </div>
        </section>
      </div>}

      {cartOpen && <div className="store-overlay cart-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="cart-header"><div><div className="eyebrow">YOUR SELECTION</div><h2 id="cart-title">Shopping bag ({cartCount})</h2></div><div className="cart-header-actions">{cart.length > 0 && <button className="continue-shopping" onClick={() => { setCart([]); localStorage.removeItem(cartKey); }}>CLEAR BAG</button>}<button className="dialog-close" onClick={() => setCartOpen(false)} aria-label="Close shopping bag">×</button></div></div>
          {cart.length ? <>
            <div className="cart-items">{cart.map(item => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;
              return <div className="cart-item" key={`${item.productId}-${item.size}`}>
                <div className="cart-item-art"><ProductArtwork product={product} /></div>
                <div className="cart-item-info"><strong>{product.name}</strong><span>Size {item.size} · ₹{displayPrice(product).toLocaleString("en-IN")}</span><div className="cart-item-actions"><button onClick={() => updateQuantity(item.productId, item.size, mode === "wholesale" ? Math.max(Number(product.min_quantity || 25), item.quantity - 1) : item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.productId, item.size, Math.min(500, item.quantity + 1))}>+</button><button className="remove-item" onClick={() => updateQuantity(item.productId, item.size, 0)}>Remove</button></div></div>
                <strong>₹{(displayPrice(product) * item.quantity).toLocaleString("en-IN")}</strong>
              </div>;
            })}</div>
            <div className="cart-summary"><div><span>Subtotal</span><strong>₹{cartTotal.toLocaleString("en-IN")}</strong></div><p>Shipping and final availability will be confirmed when your order is placed.</p><a className="add-to-bag checkout-cart-link" href={mode === "wholesale" ? "/checkout?type=wholesale" : "/checkout?type=retail"}>CONTINUE TO ORDER</a><button className="continue-shopping" onClick={() => { setCart([]); localStorage.removeItem(cartKey); }}>Clear entire bag</button><button className="continue-shopping" onClick={() => setCartOpen(false)}>Continue shopping</button></div>
          </> : <div className="cart-empty"><p>Your bag is waiting for something comfortable.</p><button className="add-to-bag" onClick={() => setCartOpen(false)}>EXPLORE THE COLLECTION</button></div>}
        </aside>
      </div>}
    </section>
  );
}
