"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";

type AdminProduct = Product & { image_url?: string | null; wholesale_price?: number | null; min_quantity?: number | null; active?: boolean; created_at?: string };
type AdminOrder = { id: string; order_number: string; order_type: string; status: string; customer_name: string; customer_phone: string; customer_email: string; delivery_address: string; delivery_city: string; delivery_state: string; delivery_postal_code: string; items: Array<{ product_name: string; size: string; quantity: number; line_total: number }>; subtotal_inr: number; created_at: string };

const ranges = ["Essential", "Everyday", "Premium", "Luxury"];
const audiences = ["Men", "Women", "Boy", "Girl"];
const statuses = ["pending_confirmation", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const money = (value: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export function AdminDashboard() {
  const [session, setSession] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [tab, setTab] = useState<"overview" | "products" | "orders">("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [form, setForm] = useState({ id: "", name: "", audience: "Men", type: "", range: "Essential", price: "799", wholesale_price: "", min_quantity: "25", sizes: "S, M, L, XL", tone: "Classic", image_url: "" });

  useEffect(() => { fetch("/api/admin/session").then(r => setSession(r.ok)).catch(() => setSession(false)); }, []);

  async function api(path: string, options: RequestInit = {}) {
    const response = await fetch(path, { ...options, credentials: "same-origin", headers: { "Content-Type": "application/json", ...options.headers } });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Request failed.");
    return result;
  }

  async function loadData() {
    if (!session) return;
    setLoading(true); setError("");
    try {
      const [productResult, orderResult] = await Promise.all([api("/api/admin/products"), api("/api/admin/orders")]);
      setProducts(productResult.products || []);
      setOrders(orderResult.orders || []);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load dashboard."); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (session) void loadData(); }, [session]);

  async function signIn(event: React.FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try { const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: adminId, password }), credentials: "same-origin" }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Sign in failed."); setSession(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Sign in failed."); }
    finally { setLoading(false); }
  }
  async function signOut() { await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" }); setSession(false); setProducts([]); setOrders([]); }

  function startNewProduct() {
    setEditing(null);
    setForm({ id: "", name: "", audience: "Men", type: "", range: "Essential", price: "799", wholesale_price: "", min_quantity: "25", sizes: "S, M, L, XL", tone: "Classic", image_url: "" });
  }
  function startEdit(product: AdminProduct) {
    setEditing(product);
    setForm({ id: product.id, name: product.name, audience: product.audience, type: product.type, range: product.range, price: String(product.price), wholesale_price: product.wholesale_price ? String(product.wholesale_price) : "", min_quantity: String(product.min_quantity || 25), sizes: product.sizes.join(", "), tone: product.tone, image_url: product.image_url || "" });
  }
  async function saveProduct(event: React.FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    try {
      await api("/api/admin/products", { method: "POST", body: JSON.stringify({ ...form, price: Number(form.price), wholesale_price: form.wholesale_price ? Number(form.wholesale_price) : null, min_quantity: Number(form.min_quantity || 25), sizes: form.sizes.split(",").map(value => value.trim()).filter(Boolean) }) });
      setMessage("Product saved."); setEditing(null); startNewProduct(); await loadData();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save product."); }
  }
  async function archiveProduct(id: string) {
    if (!window.confirm("Archive this product? It will no longer be active in the admin catalogue.")) return;
    try { await api("/api/admin/products", { method: "DELETE", body: JSON.stringify({ id }) }); setMessage("Product archived."); await loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not archive product."); }
  }
  async function updateOrder(id: string, status: string) {
    try { await api("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id, status }) }); setMessage("Order status updated."); await loadData(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not update order."); }
  }

  const revenue = useMemo(() => orders.filter(order => order.status !== "cancelled").reduce((sum, order) => sum + Number(order.subtotal_inr || 0), 0), [orders]);
  const pending = orders.filter(order => order.status === "pending_confirmation").length;

  if (!session) return <main className="admin-login-shell">
    <a href="/" className="admin-brand">NIVORA <span>ESSENTIALS</span></a>
    <form className="admin-login-card" onSubmit={signIn}>
      <div className="eyebrow">PRIVATE WORKSPACE</div><h1>Welcome <em>back.</em></h1>
      <p>Enter your private NIVORA admin credentials.</p>
      <label>Admin ID<input required autoComplete="username" value={adminId} onChange={e => setAdminId(e.target.value)} /></label>
      <label>Password<input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      {error && <p className="admin-error">{error}</p>}
      <button className="admin-primary" disabled={loading}>{loading ? "SIGNING IN…" : "SIGN IN"}</button>
    </form>
  </main>;

  return <main className="admin-shell">
    <aside className="admin-sidebar">
      <a href="/" className="admin-brand">NIVORA <span>ESSENTIALS</span></a>
      <div className="admin-side-label">WORKSPACE</div>
      {(["overview", "products", "orders"] as const).map(value => <button key={value} className={tab === value ? "active" : ""} onClick={() => setTab(value)}>{value}</button>)}
      <div className="admin-sidebar-bottom"><span>NIVORA ADMIN</span><button onClick={signOut}>Sign out ↗</button></div>
    </aside>
    <section className="admin-main">
      <header className="admin-topbar"><div><div className="eyebrow">NIVORA CONTROL ROOM</div><h1>{tab === "overview" ? "Overview" : tab === "products" ? "Products" : "Orders"}</h1></div><button className="admin-refresh" onClick={loadData}>↻ Refresh</button></header>
      {error && <p className="admin-error">{error}</p>}{message && <p className="admin-message">{message}</p>}
      {loading && <p className="admin-hint">Loading workspace…</p>}
      {tab === "overview" && <div className="admin-stats">
        <article><span>ACTIVE PRODUCTS</span><strong>{products.filter(p => p.active !== false).length}</strong></article>
        <article><span>TOTAL ORDERS</span><strong>{orders.length}</strong></article>
        <article><span>AWAITING CONFIRMATION</span><strong>{pending}</strong></article>
        <article><span>ORDER VALUE · EST.</span><strong>{money(revenue)}</strong></article>
        <section className="admin-panel admin-recent"><div className="admin-panel-heading"><h2>Recent orders</h2><button onClick={() => setTab("orders")}>View all ↗</button></div>{orders.slice(0, 5).map(order => <div className="admin-order-row" key={order.id}><div><strong>{order.order_number}</strong><span>{order.customer_name} · {order.order_type}</span></div><b>{money(order.subtotal_inr)}</b><span className="admin-status">{order.status.replaceAll("_", " ")}</span></div>)}{!orders.length && <p className="admin-hint">No orders yet.</p>}</section>
      </div>}
      {tab === "products" && <div className="admin-products-layout">
        <section className="admin-panel"><div className="admin-panel-heading"><h2>Catalogue ({products.length})</h2><button onClick={startNewProduct}>+ New product</button></div>
          <div className="admin-product-list">{products.map(product => <div className="admin-product-row" key={product.id}><div><strong>{product.name}</strong><span>{product.audience} · {product.range} · {product.type}</span></div><b>{money(product.price)}</b><button onClick={() => startEdit(product)}>Edit</button><button onClick={() => archiveProduct(product.id)}>Archive</button></div>)}</div>
        </section>
        <form className="admin-panel admin-product-form" onSubmit={saveProduct}><h2>{editing ? "Edit product" : "Add product"}</h2>
          <label>Product ID<input required value={form.id} disabled={Boolean(editing)} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="e.g. m-boxer-classic" /></label>
          <label>Product name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <div className="admin-form-pair"><label>Audience<select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>{audiences.map(v => <option key={v}>{v}</option>)}</select></label><label>Range<select value={form.range} onChange={e => setForm({ ...form, range: e.target.value })}>{ranges.map(v => <option key={v}>{v}</option>)}</select></label></div>
          <label>Product type<input required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="Boxers, Briefs, Bras…" /></label>
          <div className="admin-form-pair"><label>Retail price (INR)<input type="number" min="1" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label><label>Colour / tone<input value={form.tone} onChange={e => setForm({ ...form, tone: e.target.value })} /></label></div>
          <div className="admin-form-pair"><label>Wholesale price (INR · 30% off)<input type="number" value={form.price ? String(Math.round(Number(form.price) * 0.7)) : ""} readOnly /></label><label>Wholesale minimum quantity<input type="number" min="1" max="5000" required value={form.min_quantity} onChange={e => setForm({ ...form, min_quantity: e.target.value })} /></label></div>
          <label>Sizes (comma separated)<input required value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} /></label>
          <label>Image URL (optional)<input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></label>
          <button className="admin-primary">{editing ? "SAVE CHANGES" : "ADD PRODUCT"}</button>
        </form>
      </div>}
      {tab === "orders" && <section className="admin-panel"><div className="admin-panel-heading"><h2>All orders ({orders.length})</h2></div>
        <div className="admin-orders-list">{orders.map(order => <article className="admin-order-card" key={order.id}><div className="admin-order-card-head"><div><strong>{order.order_number}</strong><span>{new Date(order.created_at).toLocaleString("en-IN")} · {order.order_type}</span></div><b>{money(order.subtotal_inr)}</b></div>
          <div className="admin-order-customer"><strong>{order.customer_name}</strong><span>{order.customer_phone} · {order.customer_email}</span><span>{order.delivery_address}, {order.delivery_city}, {order.delivery_state} - {order.delivery_postal_code}</span></div>
          <div className="admin-order-items">{(order.items || []).map((item, index) => <span key={index}>{item.product_name} · {item.size} × {item.quantity}</span>)}</div>
          <label className="admin-status-select">ORDER STATUS<select value={order.status} onChange={e => updateOrder(order.id, e.target.value)}>{statuses.map(status => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}</select></label>
        </article>)}</div>{!orders.length && <p className="admin-hint">No orders have been placed.</p>}
      </section>}
    </section>
  </main>;
}
