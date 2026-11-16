const collections = [
  { name: "For Him", note: "MEN'S EVERYDAY ESSENTIALS", mark: "01" },
  { name: "For Her", note: "WOMEN'S EVERYDAY ESSENTIALS", mark: "02" },
  { name: "For Them", note: "KIDS & FAMILY ESSENTIALS", mark: "03" },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div>
          <div className="eyebrow">THE EVERYDAY, ELEVATED — EST. 2026</div>
          <h1>Feel good.<br /><em>Every day.</em></h1>
          <p className="hero-copy">Thoughtfully made everyday essentials, designed around the way you live. Discover comfort that feels natural, considered, and entirely your own.</p>
          <a className="primary-link" href="#collections">Discover NIVORA <span>↗</span></a>
        </div>
        <div className="hero-art" aria-label="NIVORA abstract brand artwork">
          <div className="hero-monogram">N</div>
          <div className="hero-art-note">A NEW STANDARD OF EVERYDAY</div>
        </div>
      </section>

      <section className="section" id="collections">
        <div className="section-heading">
          <div><div className="eyebrow">MADE FOR REAL LIFE</div><h2>Find your everyday.</h2></div>
          <p>One considered collection. Comfort for every age, every shape, every day.</p>
        </div>
        <div className="collection-grid">
          {collections.map((item) => (
            <a className="collection-card" href="#shop" key={item.mark}>
              <small>{item.note}</small>
              <strong>{item.name}</strong>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="standard-band" id="our-standard">
        <div><div className="eyebrow">THE NIVORA STANDARD</div><h2>Comfort is<br />the starting point.</h2></div>
        <p>Everyday essentials should feel anything but ordinary. NIVORA is built on a simple belief: the pieces closest to you deserve thoughtful design, dependable quality, and comfort without compromise.</p>
      </section>

      <section className="section" id="shop">
        <div className="eyebrow">YOUR EVERYDAY STARTS HERE</div>
        <div className="wholesale-row">
          <div><h2>Made to move with you.</h2><p>Explore the collection for personal shopping, or connect with us for bulk and wholesale enquiries.</p></div>
          <a className="text-link" href="mailto:hello@nivoraessentials.in">Enquire with NIVORA ↗</a>
        </div>
      </section>

      <section className="section" id="wholesale">
        <div className="wholesale-row">
          <div><div className="eyebrow">FOR RETAILERS & PARTNERS</div><h2>Better basics. Together.</h2><p>Looking to stock NIVORA? Our wholesale programme is being prepared. Get in touch to discuss ranges, quantities, and partnership opportunities.</p></div>
          <a className="text-link" href="mailto:wholesale@nivoraessentials.in">Wholesale enquiries ↗</a>
        </div>
      </section>
    </main>
  );
}
