import { IntroScreen } from "@/components/intro-screen";

const collections = [
  { name: "For Him", note: "MEN'S EVERYDAY ESSENTIALS", mark: "01" },
  { name: "For Her", note: "WOMEN'S EVERYDAY ESSENTIALS", mark: "02" },
  { name: "For Kids", note: "BOYS & GIRLS ESSENTIALS", mark: "03" },
];
export default function Home() {
 return <><IntroScreen /><main>
  <section className="hero"><div><div className="eyebrow">THE EVERYDAY, ELEVATED — EST. 2026</div><h1>Feel good.<br/><em>Every day.</em></h1><p className="hero-copy">Thoughtfully considered everyday essentials for men, women and kids. Comfort that feels natural, from the first layer onward.</p><div className="home-entry-actions"><a className="primary-link" href="/retail">SHOP RETAIL <span>↗</span></a><a className="secondary-link" href="/wholesale">WHOLESALE ENQUIRIES <span>↗</span></a></div></div><div className="hero-art" aria-label="NIVORA abstract brand artwork"><div className="hero-monogram">N</div><div className="hero-art-note">A NEW STANDARD OF EVERYDAY</div></div></section>
  <section className="section" id="collections"><div className="section-heading"><div><div className="eyebrow">MADE FOR REAL LIFE</div><h2>Comfort for every body.</h2></div><p>One considered collection for every age, every shape, every day.</p></div><div className="collection-grid">{collections.map(item=><a className="collection-card" href="/retail" key={item.mark}><small>{item.note}</small><strong>{item.name}</strong><span aria-hidden="true">↗</span></a>)}</div></section>
  <section className="standard-band" id="our-standard"><div><div className="eyebrow">THE NIVORA STANDARD</div><h2>Comfort is<br/>the starting point.</h2></div><p>Everyday essentials should feel anything but ordinary. Thoughtful design, dependable quality, and comfort without compromise.</p></section>
  <section className="section"><div className="wholesale-row"><div><div className="eyebrow">TWO WAYS TO SHOP NIVORA</div><h2>Personal or in bulk.</h2><p>Discover the collection for yourself, or partner with us to bring NIVORA to your customers.</p></div><div className="home-entry-actions"><a className="text-link" href="/retail">Shop retail ↗</a><a className="text-link" href="/wholesale">Wholesale ↗</a></div></div></section>
 </main></>;
}