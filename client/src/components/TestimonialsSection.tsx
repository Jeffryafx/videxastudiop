

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Maria Gonzalez",
    role: "Coach de Negocios",
    avatar: "MG",
    avatarColor: "#00E5A0",
    rating: 5,
    text: "Videxa Studio transformó mi contenido completamente. Mis reels ahora tienen un nivel cinematográfico que mis seguidores aman. El engagement subió un 300%.",
    delay: "0s",
  },
  {
    name: "Carlos Restrepo",
    role: "Fundador · TechStart",
    avatar: "CR",
    avatarColor: "#7C5CFC",
    rating: 5,
    text: "El Brand Pack fue exactamente lo que necesitabamos. Intro, outro, logo animado... todo con una coherencia visual impresionante. Entrega en tiempo record.",
    delay: "0.1s",
  },
  {
    name: "Sofia Ramirez",
    role: "Creadora de Contenido",
    avatar: "SR",
    avatarColor: "#22D3EE",
    rating: 5,
    text: "Los captions animados de Videxa son de otro nivel. Mis videos de lifestyle ahora se ven como producciones profesionales. 100% recomendados.",
    delay: "0.2s",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "#080B12" }}
    >
      {}
      <div
        className="glow-orb"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 70%)",
          top: "50%",
          right: "-100px",
          transform: "translateY(-50%)",
        }}
      />

      <div className="container relative z-10">
        {}
        <div className="text-center mb-16 reveal">
          <span className="section-label block mb-3">Lo que dicen</span>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              color: "#EEF0F7",
              letterSpacing: "-0.01em",
            }}
          >
            Clientes que confian en nosotros
          </h2>
        </div>

        {}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className="reveal service-card flex flex-col gap-4"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {}
              <Quote size={24} style={{ color: t.avatarColor, opacity: 0.5 }} />

              {}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="#00E5A0" style={{ color: "#00E5A0" }} />
                ))}
              </div>

              {}
              <p
                className="text-[#6B7494] text-sm leading-relaxed flex-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                "{t.text}"
              </p>

              {}
              <div className="flex items-center gap-3 pt-4 border-t border-[#252D42]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${t.avatarColor}20`,
                    border: `1px solid ${t.avatarColor}40`,
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: t.avatarColor,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div
                    className="text-[#EEF0F7] text-sm font-semibold"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-[#6B7494] text-xs"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
