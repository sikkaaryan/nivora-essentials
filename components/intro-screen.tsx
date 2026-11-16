"use client";

import { useEffect, useState } from "react";

export function IntroScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 4700);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="intro-screen" role="dialog" aria-label="NIVORA Essentials introduction">
      <div className="intro-inner">
        <div className="intro-wordmark">NIVORA</div>
        <div className="intro-rule" />
        <div className="intro-subtitle">E S S E N T I A L S</div>
        <div className="intro-caption">COMFORT FOR EVERY BODY</div>
      </div>
      <button className="intro-skip" onClick={() => setVisible(false)}>SKIP INTRO ↗</button>
    </div>
  );
}
