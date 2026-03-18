
import { useState } from "react";
import { Play, ExternalLink, X } from "lucide-react";

const categories = ["Todos", "reel", "motion-graphics", "brand-pack", "captions"];

const categoryLabels: Record<string, string> = {
  Todos: "Todos",
  reel: "Reels",
  "motion-graphics": "Motion Graphics",
  "brand-pack": "Brand Pack",
  captions: "Captions",
};

const categoryColors: Record<string, { color: string; accent: string }> = {
  reel: { color: "#00E5A0", accent: "rgba(0,229,160,0.15)" },
  "motion-graphics": { color: "#7C5CFC", accent: "rgba(124,92,252,0.15)" },
  captions: { color: "#22D3EE", accent: "rgba(34,211,238,0.15)" },
  "brand-pack": { color: "#00E5A0", accent: "rgba(0,229,160,0.15)" },
  promo: { color: "#22D3EE", accent: "rgba(34,211,238,0.15)" },
};

const portfolioVideos = [
  {
    id: 1,
    title: "Estáticos Marzo",
    description: "Proyecto de diseño estático con movimiento",
    category: "reel",
    duration: "60s",
    videoUrl: "/portfolio-videos/Estaticos%20Marzo.mp4",
    thumbnailUrl: "https://via.placeholder.com/400x300/7C5CFC/FFFFFF?text=Estaticos",
    clientName: "Mi Studio",
    isPublic: true,
  },  
  {
    id: 2,
    title: "Grasa Ombligo",
    description: "Pieza de movimiento y animación",
    category: "reel",
    duration: "45s",
    videoUrl: "/portfolio-videos/GRASA%20OMBLIGO-1.mp4",
    thumbnailUrl: "https://via.placeholder.com/400x300/00E5A0/FFFFFF?text=Grasa",
    clientName: "Mi Studio",
    isPublic: true,
  },
  {
    id: 3,
    title: "Hero Web",
    description: "Animación para sitio web profesional",
    category: "reel",
    duration: "30s",
    videoUrl: "/portfolio-videos/Hero%20Web.mp4",
    thumbnailUrl: "https://via.placeholder.com/400x300/22D3EE/FFFFFF?text=Hero+Web",
    clientName: "Mi Studio",
    isPublic: true,
  },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const items = portfolioVideos;

  const getColorForCategory = (category: string) => {
    return categoryColors[category] || categoryColors.reel;
  };

  const filtered = activeCategory === "Todos"
    ? items
    : items.filter((item: any) => item.category === activeCategory);

  return (
    <section
      id="portafolio"
      className="relative py-24 overflow-hidden"
      style={{ background: "#0E1220" }}
    >
      {}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #0E1220 0%, transparent 20%, transparent 80%, #0E1220 100%)" }} />

      <div className="container relative z-10">
        {}
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

        {}
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
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ gridAutoRows: '200px' }}>
          {filtered.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-[#6B7494]">
              No hay proyectos disponibles en esta categoría
            </div>
          ) : (
            filtered.map((item: any, index: number) => {
              const { color, accent } = getColorForCategory(item.category);
              return (
                <div
                  key={item.id}
                  className="reveal group relative rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedVideo(item)}
                  style={{
                    background: "linear-gradient(135deg, #0E1220 0%, #1C2335 100%)",
                    border: "1px solid #252D42",
                    transitionDelay: `${index * 0.08}s`,
                  }}
                >
                  {}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(ellipse at center, ${accent} 0%, transparent 70%)` }}
                  />

                  {}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 0 1px ${color}40` }}
                  />

                  {}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: `${color}20`, border: `2px solid ${color}60`, backdropFilter: "blur(8px)" }}
                    >
                      <Play size={20} fill={color} style={{ color: color, marginLeft: "2px" }} />
                    </div>
                  </div>

                  {}
                  <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: "linear-gradient(to top, rgba(8,11,18,0.9) 0%, transparent 100%)" }}>
                    <div className="flex items-end justify-between">
                      <div>
                        <span
                          className="text-xs font-semibold mb-1 block"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: color, letterSpacing: "0.06em", textTransform: "uppercase" }}
                        >
                          {item.category.replace(/-/g, " ")} · {item.duration || "60s"}
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
                        style={{ color: color }}
                      />
                    </div>
                  </div>

                  {}
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
                          fill={color}
                        />
                      ))}
                    </svg>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
              >
                <X size={24} />
              </button>
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full rounded-lg"
                style={{ maxHeight: "80vh", objectFit: "contain" }}
              />
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
                {selectedVideo.clientName && (
                  <p className="text-gray-400 mt-2">{selectedVideo.clientName}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {}
        <div className="text-center mt-12 reveal">
          <p className="text-[#6B7494] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Más de 120 proyectos completados
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
