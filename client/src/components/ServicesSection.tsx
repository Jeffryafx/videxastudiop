/*
 * VIDEXA STUDIO — Services Section
 * Design: 3-column offset grid, glassmorphism cards, stagger animation
 * Cards: hover scale(1.03) + emerald border glow
 */

import { Scissors, Sparkles, Package, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Scissors,
    iconColor: "#22D3EE",
    iconBg: "rgba(34,211,238,0.1)",
    title: "Motion Edit",
    description: "Cortes dinamicos, captions animados y color grading profesional.",
    price: "desde $25",
    features: ["Cortes dinamicos", "Captions animados", "Color grading", "Musica sincronizada"],
    popular: false,
    delay: "0s",
  },
  {
    icon: Sparkles,
    iconColor: "#7C5CFC",
    iconBg: "rgba(124,92,252,0.1)",
    title: "Motion Graphics",
    description: "Animaciones avanzadas, motion graphics y elementos de marca.",
    price: "mas popular",
    features: ["Animaciones 2D/3D", "Elementos de marca", "Transiciones premium", "Lower thirds"],
    popular: true,
    delay: "0.1s",
  },
  {
    icon: Package,
    iconColor: "#00E5A0",
    iconBg: "rgba(0,229,160,0.1)",
    title: "Brand Pack",
    description: "Paquete mensual con branding completo, intro/outro y logo.",
    price: "desde $75",
    features: ["Branding completo", "Intro / Outro", "Logo animado", "Soporte mensual"],
    popular: false,
    delay: "0.2s",
  },
];

export default function ServicesSection() {
  const scrollToContact = () => {
    const el = document.querySelector("#contacto");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="servicios"
      className="relative py-24 overflow-hidden"
      style={{ background: "#080B12" }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Glow orb */}
      <div
        className="glow-orb"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 reveal">
          <span className="section-label block mb-3">Lo que hacemos</span>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              color: "#EEF0F7",
              letterSpacing: "-0.01em",
            }}
          >
            Nuestros servicios
          </h2>
          <p
            className="text-[#6B7494] mt-4 max-w-xl mx-auto"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", lineHeight: 1.7 }}
          >
            Edicion de video de alto impacto para que tu contenido destaque en cualquier plataforma.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={`service-card reveal flex flex-col ${service.popular ? "ring-1 ring-[#7C5CFC]/40" : ""}`}
                style={{
                  animationDelay: service.delay,
                  transitionDelay: `${index * 0.1}s`,
                  ...(service.popular
                    ? { boxShadow: "0 0 40px rgba(124,92,252,0.15), 0 0 0 1px rgba(124,92,252,0.2)" }
                    : {}),
                }}
              >
                {/* Popular badge */}
                {service.popular && (
                  <div className="flex justify-end mb-3">
                    <span className="badge-popular">mas popular</span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: service.iconBg }}
                >
                  <Icon size={22} style={{ color: service.iconColor }} />
                </div>

                {/* Title & description */}
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#EEF0F7",
                    marginBottom: "0.5rem",
                  }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#6B7494] text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {service.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="flex-shrink-0" style={{ color: service.iconColor }} />
                      <span
                        className="text-[#6B7494] text-sm"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="mt-auto pt-5 border-t border-[#252D42] flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: service.popular ? "#7C5CFC" : "#00E5A0",
                    }}
                  >
                    {service.price}
                  </span>
                  <button
                    onClick={scrollToContact}
                    className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      background: service.popular
                        ? "linear-gradient(135deg, #7C5CFC, #22D3EE)"
                        : "transparent",
                      color: service.popular ? "white" : "#00E5A0",
                      border: service.popular ? "none" : "1px solid rgba(0,229,160,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      if (!service.popular) {
                        (e.target as HTMLElement).style.background = "rgba(0,229,160,0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!service.popular) {
                        (e.target as HTMLElement).style.background = "transparent";
                      }
                    }}
                  >
                    Cotizar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
