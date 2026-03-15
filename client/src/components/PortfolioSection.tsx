/*
 * VIDEXA STUDIO — Portfolio Section
 * Design: Masonry-style grid with category filters, dark cards with hover overlay
 */

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";

const categories = ["Todos", "Reels", "Motion Graphics", "Brand Pack", "Captions"];

const portfolioItems = [
  {
    id: 1,
    title: "Coach de Negocios — Reel Viral",
    category: "Reels",
    type: "Reel · 60s",
    color: "#00E5A0",
    bg: "linear-gradient(135deg, #0E1220 0%, #1C2335 100%)",
    accent: "rgba(0,229,160,0.15)",
    span: "col-span-1 row-span-1",
  },
  {
    id: 2,
    title: "Marca de Moda — Motion Graphics",
    category: "Motion Graphics",
    type: "Motion · 30s",
    color: "#7C5CFC",
    bg: "linear-gradient(135deg, #0E1220 0%, #1C2335 100%)",
    accent: "rgba(124,92,252,0.15)",
    span: "col-span-1 row-span-2",
  },
  {
    id: 3,
    title: "Podcast — Captions Animados",
    category: "Captions",
    type: "Captions · 45s",
    color: "#22D3EE",
    bg: "linear-gradient(135deg, #0E1220 0%, #1C2335 100%)",
    accent: "rgba(34,211,238,0.15)",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    title: "Startup Tech — Brand Pack",
    category: "Brand Pack",
    type: "Brand · Full",
    color: "#00E5A0",
    bg: "linear-gradient(135deg, #0E1220 0%, #1C2335 100%)",
    accent: "rgba(0,229,160,0.15)",
    span: "col-span-2 row-span-1",
  },
  {
    id: 5,
    title: "Influencer — Reel Lifestyle",
    category: "Reels",
    type: "Reel · 90s",
    color: "#7C5CFC",
    bg: "linear-gradient(135deg, #0E1220 0%, #1C2335 100%)",
    accent: "rgba(124,92,252,0.15)",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    title: "Restaurante — Promo Video",
    category: "Motion Graphics",
    type: "Promo · 60s",
    color: "#22D3EE",
    bg: "linear-gradient(135deg, #0E1220 0%, #1C2335 100%)",
    accent: "rgba(34,211,238,0.15)",
    span: "col-span-1 row-span-1",
  },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = activeCategory === "Todos"
    ? portfolioItems
    : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section
      id="portafolio"
      className="relative py-24 overflow-hidden"
      style={{ background: "#0E1220" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url(https://d2xsxph8kpxj0f.cloudfront.net/310519663438801757/7KKxXnXYeQKbj9epp3KDoh/videxa-portfolio-bg-Pi3zDHXcXDkDi5U8EaioSA.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0E1220 0%, transparent 20%, transparent 80%, #0E1220 100%)" }} />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <span className="section-label block mb-3">Nuestro trabajo</span>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              color: "#EEF0F7",
              letterSpacing: "-0.01em",
            }}
          >
            Portafolio
          </h2>
          <p
            className="text-[#6B7494] mt-4 max-w-lg mx-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", lineHeight: 1.7 }}
          >
            Proyectos reales para marcas y creadores que quieren destacar.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 reveal">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: activeCategory === cat
                  ? "linear-gradient(135deg, #00E5A0, #22D3EE)"
                  : "rgba(28,35,53,0.8)",
                color: activeCategory === cat ? "#080B12" : "#6B7494",
                border: activeCategory === cat ? "none" : "1px solid #252D42",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridAutoRows: '200px' }}>
          {filtered.map((item, index) => (
            <div
              key={item.id}
              className={`reveal group relative rounded-2xl overflow-hidden cursor-pointer ${item.span}`}
              style={{
                background: item.bg,
                border: "1px solid #252D42",
                transitionDelay: `${index * 0.08}s`,
              }}
            >
              {/* Accent glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(ellipse at center, ${item.accent} 0%, transparent 70%)` }}
              />

              {/* Border glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 0 1px ${item.color}40` }}
              />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: `${item.color}20`, border: `2px solid ${item.color}60`, backdropFilter: "blur(8px)" }}
                >
                  <Play size={20} fill={item.color} style={{ color: item.color, marginLeft: "2px" }} />
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(8,11,18,0.9) 0%, transparent 100%)" }}>
                <div className="flex items-end justify-between">
                  <div>
                    <span
                      className="text-xs font-semibold mb-1 block"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: item.color, letterSpacing: "0.06em", textTransform: "uppercase" }}
                    >
                      {item.type}
                    </span>
                    <h3
                      className="text-sm font-bold text-[#EEF0F7] leading-tight"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <ExternalLink
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0 ml-2"
                    style={{ color: item.color }}
                  />
                </div>
              </div>

              {/* Decorative waveform */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <svg width="60" height="30" viewBox="0 0 60 30">
                  {[4, 12, 20, 28, 36, 44, 52].map((x, i) => (
                    <rect
                      key={x}
                      x={x}
                      y={15 - [8, 14, 10, 15, 7, 12, 9][i]}
                      width="4"
                      height={[16, 28, 20, 30, 14, 24, 18][i]}
                      rx="2"
                      fill={item.color}
                    />
                  ))}
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal">
          <p className="text-[#6B7494] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Mas de 120 proyectos completados
          </p>
          <button
            onClick={() => {
              const el = document.querySelector("#contacto");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="btn-primary"
          >
            Cotizar mi proyecto
          </button>
        </div>
      </div>
    </section>
  );
}
