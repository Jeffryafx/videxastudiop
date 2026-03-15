

import { Play, Zap, Award } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";

function StatItem({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(end, 2000, suffix);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div
        className="stat-number"
        style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "2rem", lineHeight: 1 }}
      >
        {count}{suffix}
      </div>
      <div className="text-[#6B7494] text-sm mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {label}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{ background: "#080B12" }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(8,11,18,0.88) 0%, rgba(8,11,18,0.5) 50%, rgba(8,11,18,0.92) 100%)",
        }}
      />
      <div
        className="glow-orb animate-orb-float"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0,229,160,0.12) 0%, transparent 70%)",
          top: "-100px",
          left: "-150px",
        }}
      />
      <div
        className="glow-orb"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(124,92,252,0.1) 0%, transparent 70%)",
          bottom: "0",
          right: "-100px",
        }}
      />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)] py-16">
          <div className="flex flex-col gap-6">
            <div className="animate-fade-in inline-flex items-center gap-2 self-start" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#252D42] bg-[#1C2335]/60">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] animate-pulse" />
                <span className="section-label">Edicion profesional · Colombia</span>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h1
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2.8rem, 6vw, 4rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                  color: "#EEF0F7",
                }}
              >
                Videos que paran el{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #00E5A0, #22D3EE)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  scroll
                </span>{" "}
                y venden
              </h1>
            </div>

            <p
              className="animate-fade-in text-[#6B7494] max-w-lg"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                animationDelay: "0.35s",
              }}
            >
              Motion graphics, captions animados y edicion de alto impacto para coaches, marcas y creadores.
            </p>

            <div className="animate-fade-in flex flex-wrap gap-2" style={{ animationDelay: "0.45s" }}>
              {["Motion Graphics", "Reels", "Captions", "Color Grading"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-[#252D42] text-[#6B7494]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "0.04em" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="animate-fade-in flex flex-wrap gap-3 mt-2" style={{ animationDelay: "0.55s" }}>
              <button
                onClick={() => scrollToSection("#portafolio")}
                className="btn-primary animate-glow-pulse flex items-center gap-2"
              >
                <Play size={16} fill="currentColor" />
                Ver portafolio
              </button>
              <button
                onClick={() => scrollToSection("#contacto")}
                className="btn-secondary flex items-center gap-2"
              >
                <Zap size={16} />
                Cotizar ahora
              </button>
            </div>

            <div className="animate-fade-in mt-4 flex gap-8 pt-6 border-t border-[#252D42]" style={{ animationDelay: "0.7s" }}>
              <StatItem end={120} suffix="+" label="Proyectos" />
              <StatItem end={98} suffix="%" label="Satisfaccion" />
              <StatItem end={4} suffix="+" label="Anos exp." />
            </div>
          </div>

          <div className="animate-slide-in-right hidden lg:flex items-center justify-center" style={{ animationDelay: "0.4s" }}>
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(0,229,160,0.15) 0%, transparent 70%)",
                  transform: "scale(1.2)",
                  filter: "blur(20px)",
                }}
              />
              <div
                className="relative rounded-2xl overflow-hidden border border-[#252D42]"
                style={{
                  boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,160,0.1)",
                  maxWidth: "480px",
                }}
              >
                <img
                  alt="Video editing interface mockup"
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663438801757/7KKxXnXYeQKbj9epp3KDoh/videxa-mockup-card-SxaD7Kq4bMQzS9VXHHWrcv.webp" 
                  style={{ display: "block" }}
                />
                <div
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(28, 35, 53, 0.9)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(37,45,66,0.8)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-[#00E5A0]" />
                    <span className="text-[#EEF0F7] text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Entrega en 48h
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#00E5A0] animate-pulse" />
                    <span className="text-[#00E5A0] text-xs font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Disponible
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="absolute -top-4 -right-6 px-3 py-2 rounded-xl border border-[#7C5CFC]/30"
                style={{
                  background: "rgba(28, 35, 53, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 30px rgba(124,92,252,0.2)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#7C5CFC]/40 flex-shrink-0">
                  
                  </div>
                  <div>
                    <div className="text-[#EEF0F7] text-xs font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      Motion Graphics
                    </div>
                    <div className="text-[#6B7494] text-[10px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Animaciones premium
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #080B12)" }}
      />
    </section>
  );
}
