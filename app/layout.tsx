import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "NIVORA ESSENTIALS — Comfort for Every Body",
  description: "Premium everyday essentials for men, women, and kids. Comfort for every body.",
  applicationName: "NIVORA ESSENTIALS",
  icons: { icon: "/nivora-monogram.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f0e8" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nivora-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <header className="site-header">
          <a className="header-wordmark" href="/" aria-label="NIVORA Essentials home">
            NI<span className="wordmark-v">V</span>ORA<span className="header-essentials">ESSENTIALS</span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#collections">Collections</a>
            <a href="#our-standard">Our standard</a>
            <a href="#wholesale">Wholesale</a>
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <a className="bag-link" href="/retail">Shop <span aria-hidden="true">↗</span></a>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <a className="footer-wordmark" href="/">NIVORA</a>
          <span>COMFORT FOR EVERY BODY.</span>
          <span>© {new Date().getFullYear()} NIVORA ESSENTIALS</span>
        </footer>
      </body>
    </html>
  );
}
