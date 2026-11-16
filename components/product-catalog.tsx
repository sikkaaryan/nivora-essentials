"use client";

import { useEffect, useMemo, useState } from "react";
import { products as previewProducts, type Product } from "@/data/products";
type CatalogMode = "retail" | "wholesale";
type CatalogProduct = Product & { wholesale_price?: number | null };

type CartItem = { productId: string; size: string; quantity: number };
const audienceNames = ["All", "Men", "Women", "Boy", "Girl"];
const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"];
const rangeNames = ["All", "Essential", "Everyday", "Premium", "Luxury"];
const CART_KEY = "nivora-cart-v1";

function ProductArtwork({ product }: { product: Product }) {
  const artwork = product.audience === "Men" ? "/products/men.svg" : product.audience === "Women" ? "/products/women.svg" : product.audience === "Boy" ? "/products/boy.svg" : "/products/girl.svg";
  return <div className="product-art"><img src={artwork} alt={`${product.audience} ${product.type} collection artwork`} /></div>;
}

export function ProductCatalog({ mode = "retail" }: { mode?: CatalogMode }) {
  const [products, setProducts] = useState<CatalogProduct[]>(previewProducts);
  const [audience, setAudience] = useState("All");
  const [type, setType] = useState("All");
  const [size, setSize] = useState("All");
  const [range, setRange] = useState("All");
  const [sort, setSort] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved) as CartItem[]);
    } catch { /* Ignore invalid local cart data. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

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

  const displayPrice = (product: CatalogProduct) => mode === "wholesale" && product.wholesale_price ? product.wholesale_price : product.price;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? displayPrice(product) : 0) * item.quantity;
  }, 0);

  function changeAudience(value: string) { setAudience(value); setType("All"); }
  function openProduct(product: Product) {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] ?? "");
    setQuantity(1);
    setNotice("");
  }
  function addToCart() {
    if (!selectedProduct || !selectedSize) return;
    setCart(current => {
      const existing = current.find(item => item.productId === selectedProduct.id && item.size === selectedSize);
      return existing
        ? current.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { productId: selectedProduct.id, size: selectedSize, quantity }];
    });
    setSelectedProduct(null);
    setNotice(`${selectedProduct.name} added to your bag`);
    setCartOpen(true);
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
            <p>{product.type} <span>·</span> {product.sizes.join(" / ")}</p>
            <button className="quick-add" onClick={() => openProduct(product)}>VIEW DETAILS <span>↗</span></button>
          </article>)}</div> : <div className="empty-results">No styles match these filters. Try another size or range.</div>}
        </div>
      </div>
      <p className="catalog-disclaimer">{mode === "wholesale" ? "Trade prices are shown where configured; otherwise the listed retail amount is indicative only. Our team confirms wholesale rates, minimum quantities and stock after your enquiry." : "Collection preview · Product artwork, styles and INR prices are provisional and can be updated before launch."}</p>

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
            <span className="choice-label">QUANTITY</span>
            <div className="quantity-control"><button onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button><span>{quantity}</span><button onClick={() => setQuantity(q => Math.min(10, q + 1))} aria-label="Increase quantity">+</button></div>
            <button className="add-to-bag" onClick={addToCart}>ADD TO BAG — ₹{(displayPrice(selectedProduct) * quantity).toLocaleString("en-IN")}</button>
            <p className="provisional-note">Preview product · Final images, fabric details and stock confirmation will be added before launch.</p>
          </div>
        </section>
      </div>}

      {cartOpen && <div className="store-overlay cart-overlay" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="cart-header"><div><div className="eyebrow">YOUR SELECTION</div><h2 id="cart-title">Shopping bag ({cartCount})</h2></div><button className="dialog-close" onClick={() => setCartOpen(false)} aria-label="Close shopping bag">×</button></div>
          {cart.length ? <>
            <div className="cart-items">{cart.map(item => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;
              return <div className="cart-item" key={`${item.productId}-${item.size}`}>
                <div className="cart-item-art"><ProductArtwork product={product} /></div>
                <div className="cart-item-info"><strong>{product.name}</strong><span>Size {item.size} · ₹{displayPrice(product).toLocaleString("en-IN")}</span><div className="cart-item-actions"><button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}>+</button><button className="remove-item" onClick={() => updateQuantity(item.productId, item.size, 0)}>Remove</button></div></div>
                <strong>₹{(displayPrice(product) * item.quantity).toLocaleString("en-IN")}</strong>
              </div>;
            })}</div>
            <div className="cart-summary"><div><span>Subtotal</span><strong>₹{cartTotal.toLocaleString("en-IN")}</strong></div><p>Shipping and final availability will be confirmed when your order is placed.</p><a className="add-to-bag checkout-cart-link" href={mode === "wholesale" ? "/checkout?type=wholesale" : "/checkout?type=retail"}>CONTINUE TO ORDER</a><button className="continue-shopping" onClick={() => setCartOpen(false)}>Continue shopping</button></div>
          </> : <div className="cart-empty"><p>Your bag is waiting for something comfortable.</p><button className="add-to-bag" onClick={() => setCartOpen(false)}>EXPLORE THE COLLECTION</button></div>}
        </aside>
      </div>}
    </section>
  );
}
