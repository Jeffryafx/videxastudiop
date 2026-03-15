

import { Instagram, Youtube, Twitter, Heart } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="relative border-t border-[#252D42]"
      style={{ background: "#080B12" }}
    >
      {}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url(data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(8,11,18,0.85)" }} />
        <div className="container relative z-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "120+", label: "Proyectos completados" },
              { value: "98%", label: "Satisfaccion del cliente" },
              { value: "48h", label: "Tiempo de entrega" },
              { value: "4+", label: "Anos de experiencia" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="stat-number mb-1"
                  style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: "2.2rem" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-[#6B7494] text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-10">
          {}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00E5A0] to-[#22D3EE]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 4L9 2L15 4V9C15 13 9 16 9 16C9 16 3 13 3 9V4Z" fill="#080B12" />
                    <path d="M7 8L9 6L11 8L9 10L7 8Z" fill="#00E5A0" />
                  </svg>
                </div>
              </div>
              <span
                style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.01em" }}
                className="text-[#EEF0F7]"
              >
                Videxa <span className="text-[#00E5A0]">Studio</span>
              </span>
            </div>
            <p
              className="text-[#6B7494] text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Videos que paran el scroll y convierten seguidores en clientes. Edicion profesional desde Colombia para el mundo.
            </p>
            {}
            <div className="flex gap-3 mt-2">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#252D42] text-[#6B7494] hover:text-[#00E5A0] hover:border-[#00E5A0]/40 transition-all duration-200"
                  style={{ background: "#1C2335" }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {}
          <div className="flex flex-col gap-3">
            <h4
              className="text-[#EEF0F7] text-sm font-semibold mb-1"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Navegacion
            </h4>
            {[
              { label: "Inicio", href: "#inicio" },
              { label: "Portafolio", href: "#portafolio" },
              { label: "Servicios", href: "#servicios" },
              { label: "Contacto", href: "#contacto" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                className="text-[#6B7494] text-sm hover:text-[#00E5A0] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {}
          <div className="flex flex-col gap-3">
            <h4
              className="text-[#EEF0F7] text-sm font-semibold mb-1"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Servicios
            </h4>
            {["Motion Edit", "Motion Graphics", "Brand Pack", "Captions Animados", "Color Grading"].map((service) => (
              <a
                key={service}
                href="#servicios"
                onClick={(e) => { e.preventDefault(); scrollToSection("#servicios"); }}
                className="text-[#6B7494] text-sm hover:text-[#00E5A0] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {service}
              </a>
            ))}
          </div>
        </div>

        {}
        <div className="mt-12 pt-6 border-t border-[#252D42] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[#6B7494] text-xs flex items-center gap-1.5"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            2024 Videxa Studio. Hecho con{" "}
            <Heart size={12} fill="#7C5CFC" style={{ color: "#7C5CFC" }} />{" "}
            en Colombia.
          </p>
          <div className="flex gap-5">
            {["Privacidad", "Terminos"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[#6B7494] text-xs hover:text-[#EEF0F7] transition-colors"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
