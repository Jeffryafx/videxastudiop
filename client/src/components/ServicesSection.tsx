

import { Scissors, Sparkles, Package, CheckCircle, Loader2, Film, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";

const serviceMetadata = {
  'motion-edit': {
    icon: Scissors,
    iconColor: "#22D3EE",
    iconBg: "rgba(34,211,238,0.1)",
    features: ["Cortes dinamicos", "Captions animados", "Color grading", "Musica sincronizada"],
    popular: false,
    delay: "0s",
  },
  'motion-graphics': {
    icon: Sparkles,
    iconColor: "#7C5CFC",
    iconBg: "rgba(124,92,252,0.1)",
    features: ["Animaciones 2D/3D", "Elementos de marca", "Transiciones premium", "Lower thirds"],
    popular: true,
    delay: "0.1s",
  },
  'brand-pack': {
    icon: Package,
    iconColor: "#00E5A0",
    iconBg: "rgba(0,229,160,0.1)",
    features: ["Branding completo", "Intro / Outro", "Logo animado", "Soporte mensual"],
    popular: false,
    delay: "0.2s",
  },
  'video-corporativo': {
    icon: Film,
    iconColor: "#FF6B6B",
    iconBg: "rgba(255,107,107,0.1)",
    features: ["Producción profesional", "Edición avanzada", "Efectos visuales", "Audio profesional"],
    popular: false,
    delay: "0.3s",
  },
  'social-media-content': {
    icon: Zap,
    iconColor: "#FFD93D",
    iconBg: "rgba(255,217,61,0.1)",
    features: ["Contenido viral", "Optimización plataforma", "Captions atractivos", "Alta calidad"],
    popular: false,
    delay: "0.4s",
  },
} as const;

const defaultMetadata = {
  icon: Sparkles,
  iconColor: "#00E5A0",
  iconBg: "rgba(0,229,160,0.1)",
  popular: false,
};

export default function ServicesSection() {
  const servicesQuery = trpc.services.list.useQuery();
  const services = servicesQuery.data || [];

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
      {}
      <div className="absolute inset-0 dot-grid opacity-40" />

      {}
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
        {}
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

        {}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {servicesQuery.isLoading ? (
            <div className="col-span-3 flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#00E5A0]" />
            </div>
          ) : (
            services.map((service: any, index: number) => {
              const metadata = serviceMetadata[service.slug as keyof typeof serviceMetadata] || serviceMetadata[service.category as keyof typeof serviceMetadata] || { ...defaultMetadata, delay: `${index * 0.1}s` };
              
              const Icon = metadata.icon || defaultMetadata.icon;
              const iconColor = metadata.iconColor || defaultMetadata.iconColor;
              const iconBg = metadata.iconBg || defaultMetadata.iconBg;
              const popular = metadata.popular || defaultMetadata.popular;
              const delay = metadata.delay || `${index * 0.1}s`;
              return (
                <div
                  key={service.id}
                  className={`service-card reveal flex flex-col ${popular ? "ring-1 ring-[#7C5CFC]/40" : ""}`}
                  style={{
                    animationDelay: delay,
                    transitionDelay: `${index * 0.1}s`,
                    ...(popular
                      ? { boxShadow: "0 0 40px rgba(124,92,252,0.15), 0 0 0 1px rgba(124,92,252,0.2)" }
                      : {}),
                  }}
                >
                  {popular && (
                    <div className="flex justify-end mb-3">
                      <span className="badge-popular">mas popular</span>
                    </div>
                  )}

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: iconBg }}
                  >
                    <Icon size={22} style={{ color: iconColor }} />
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#EEF0F7",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {service.name}
                  </h3>
                  <p
                    className="text-[#6B7494] text-sm leading-relaxed mb-6"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {service.description}
                  </p>

                  <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                    {(service.features ? service.features.split(',').map((f: string) => f.trim()) : []).map((feature: string) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <CheckCircle size={14} className="flex-shrink-0" style={{ color: iconColor }} />
                        <span
                          className="text-[#6B7494] text-sm"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 border-t border-[#252D42] flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: metadata.popular ? "#7C5CFC" : "#00E5A0",
                      }}
                    >
                      ${parseFloat(service.basePrice).toFixed(2)}
                    </span>
                    <button
                      onClick={scrollToContact}
                      className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: metadata.popular
                          ? "linear-gradient(135deg, #7C5CFC, #22D3EE)"
                          : "transparent",
                        color: metadata.popular ? "white" : "#00E5A0",
                        border: metadata.popular ? "none" : "1px solid rgba(0,229,160,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        if (!metadata.popular) {
                          (e.target as HTMLElement).style.background = "rgba(0,229,160,0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!metadata.popular) {
                          (e.target as HTMLElement).style.background = "transparent";
                        }
                      }}
                    >
                      Cotizar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
