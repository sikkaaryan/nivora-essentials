"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
type StoreProduct = { id: string; name: string; price: number; wholesale_price?: number | null; min_quantity?: number | null; sizes: string[] };

type CartItem = { productId: string; size: string; quantity: number };
type OrderType = "retail" | "wholesale";
const CART_KEY = "nivora-cart-v1";

export function CheckoutForm() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("retail");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ orderNumber: string; emailSent: boolean } | null>(null);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "", city: "", state: "", postalCode: "", notes: "",
    businessName: "", gstin: "",
  });

  useEffect(() => {
    fetch("/api/products").then(r => r.ok ? r.json() : null).then(data => { if (Array.isArray(data?.products)) setProducts(data.products); }).catch(() => undefined);
    const requestedType = new URLSearchParams(window.location.search).get("type");
    if (requestedType === "wholesale") setOrderType("wholesale");
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved) as CartItem[]);
    } catch { setCart([]); }
  }, []);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = useMemo(() => cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? (orderType === "wholesale" && product.wholesale_price || Math.round(product.price * 0.7)) : 0) * item.quantity;
  }, 0), [cart, products, orderType]);
  const invalidWholesale = orderType === "wholesale" && cart.some(item => item.quantity < Number(products.find(p => p.id === item.productId)?.min_quantity || 25));

  function updateField(key: keyof typeof form, value: string) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!cart.length) { setError("Your shopping bag is empty."); return; }
    if (invalidWholesale) { setError("Each wholesale item must meet its own minimum quantity shown in your order summary."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, orderType, items: cart }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not submit your order. Please try again.");
      setSuccess({ orderNumber: result.orderNumber, emailSent: Boolean(result.emailSent) });
      localStorage.removeItem(CART_KEY);
      setCart([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) return <section className="checkout-success">
    <div className="eyebrow">ORDER REQUEST RECEIVED</div>
    <div className="success-mark">✓</div>
    <h1>Thank you.<br /><em>We’ll be in touch.</em></h1>
    <p>Your order request <strong>{success.orderNumber}</strong> has been recorded. Our team will confirm product availability, delivery details and the final amount before sharing payment instructions.</p>
    <p className="checkout-small">{success.emailSent ? "Our store team has also been notified." : "Your order is recorded. Store email notification is not configured yet."}</p>
    <Link className="checkout-primary" href="/">RETURN TO NIVORA</Link>
  </section>;

  return <div className="checkout-shell">
    <div className="checkout-top"><Link href="/" className="checkout-wordmark">NIVORA <span>ESSENTIALS</span></Link><Link href="/#shop" className="checkout-back">← CONTINUE SHOPPING</Link></div>
    <div className="checkout-heading"><div className="eyebrow">THE FINAL STEP</div><h1>Make it <em>yours.</em></h1><p>Place your order now. Payment happens after our team confirms availability.</p></div>
    <form className="checkout-grid" onSubmit={submitOrder}>
      <div className="checkout-fields">
        <section className="checkout-panel">
          <div className="checkout-section-title"><span>01</span><h2>Order type</h2></div>
          <div className="order-type-options">
            <button type="button" className={orderType === "retail" ? "chosen" : ""} onClick={() => setOrderType("retail")}><strong>Personal order</strong><span>Shop for yourself or family</span></button>
            <button type="button" className={orderType === "wholesale" ? "chosen" : ""} onClick={() => setOrderType("wholesale")}><strong>Wholesale order</strong><span>Bulk buying with per-product minimum quantities</span></button>
          </div>
          {orderType === "wholesale" && <p className="checkout-hint">Each product has its own minimum quantity. Wholesale prices are 30% below the listed retail price; final availability is confirmed before payment.</p>}
        </section>

        <section className="checkout-panel">
          <div className="checkout-section-title"><span>02</span><h2>Your details</h2></div>
          <div className="checkout-form-grid">
            <label>Full name<input required autoComplete="name" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Your name" /></label>
            <label>Phone number<input required type="tel" autoComplete="tel" minLength={10} maxLength={15} value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+91 00000 00000" /></label>
            <label className="full-field">Email address<input required type="email" autoComplete="email" value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="you@example.com" /></label>
            {orderType === "wholesale" && <>
              <label className="full-field">Business / store name<input required value={form.businessName} onChange={e => updateField("businessName", e.target.value)} placeholder="Business name" /></label>
              <label className="full-field">GSTIN (optional)<input value={form.gstin} onChange={e => updateField("gstin", e.target.value.toUpperCase())} placeholder="GST identification number" /></label>
            </>}
          </div>
        </section>

        <section className="checkout-panel">
          <div className="checkout-section-title"><span>03</span><h2>Delivery address</h2></div>
          <div className="checkout-form-grid">
            <label className="full-field">Address<input required autoComplete="street-address" value={form.address} onChange={e => updateField("address", e.target.value)} placeholder="House / flat, street, area" /></label>
            <label>City<input required autoComplete="address-level2" value={form.city} onChange={e => updateField("city", e.target.value)} /></label>
            <label>State<input required autoComplete="address-level1" value={form.state} onChange={e => updateField("state", e.target.value)} /></label>
            <label>PIN code<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="postal-code" value={form.postalCode} onChange={e => updateField("postalCode", e.target.value)} placeholder="6-digit PIN" /></label>
            <label className="full-field">Order notes (optional)<textarea rows={3} value={form.notes} onChange={e => updateField("notes", e.target.value)} placeholder="Anything we should know about your order?" /></label>
          </div>
        </section>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="checkout-submit" type="submit" disabled={loading || !cart.length || invalidWholesale}>{loading ? "PLACING YOUR ORDER…" : "PLACE ORDER — PAY LATER"}</button>
        <p className="checkout-legal">No online payment is collected at this stage. Our team will contact you to confirm stock, shipping and payment instructions.</p>
      </div>

      <aside className="checkout-summary">
        <div className="eyebrow">YOUR SELECTION</div><h2>Order summary</h2>
        {cart.length ? cart.map(item => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          return <div className="checkout-line" key={item.productId + item.size}><div><strong>{product.name}</strong><span>Size {item.size} · Qty {item.quantity}{orderType === "wholesale" ? ` · Min ${Number(product.min_quantity || 25)}` : ""}</span></div><b>₹{((orderType === "wholesale" && product.wholesale_price ? product.wholesale_price : product.price) * item.quantity).toLocaleString("en-IN")}</b></div>;
        }) : <p className="checkout-hint">Your bag is empty. <Link href="/#shop">Explore the collection.</Link></p>}
        <div className="checkout-total"><span>Estimated subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
        <p className="checkout-hint">Shipping, taxes (if applicable), wholesale rates and final stock availability are confirmed by our team. This is not a payment request.</p>
      </aside>
    </form>
    <footer className="checkout-footer">NIVORA ESSENTIALS · COMFORT FOR EVERY BODY.</footer>
  </div>;
}
