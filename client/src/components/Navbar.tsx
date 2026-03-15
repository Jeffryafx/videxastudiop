

import { useState, useEffect } from "react";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Portafolio", href: "#portafolio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Blog", href: "#blog" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setLocation("/");
  };

  const handleDashboard = () => {
    setUserMenuOpen(false);
    if (user?.role === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/dashboard");
    }
  };

  return (
    <nav
      className={`videxa-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-4"
      }`}
    >
      <div className="container flex items-center justify-between">
        {}
        <a
          href="#inicio"
          onClick={(e) => { e.preventDefault(); handleNavClick("#inicio"); }}
          className="flex items-center gap-2.5 group"
        >
          {}
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00E5A0] to-[#22D3EE] opacity-90 group-hover:opacity-100 transition-opacity" />
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
        </a>

        {}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        {}
        <div className="hidden md:flex items-center gap-3">
          {user ? (

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00E5A0]/10 border border-[#00E5A0]/30 hover:border-[#00E5A0]/60 transition-colors text-[#00E5A0]"
              >
                <User size={18} />
                <span className="font-medium text-sm">{user.name || user.email}</span>
              </button>

              {}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0E1220] border border-[#252D42] rounded-lg shadow-lg overflow-hidden z-50">
                  {}
                  <div className="px-4 py-3 border-b border-[#252D42]">
                    <p className="text-xs text-[#6B7494]">Logueado como</p>
                    <p className="text-sm font-medium text-[#EEF0F7]">{user.name || user.email}</p>
                    <p className="text-xs text-[#6B7494] mt-1">{user.email}</p>
                    <p className="text-xs text-[#00E5A0] font-medium mt-2">
                      Rol: <span className="uppercase">{user.role}</span>
                    </p>
                  </div>

                  {}
                  <button
                    onClick={handleDashboard}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-[#6B7494] hover:text-[#EEF0F7] hover:bg-[#252D42] transition-colors text-sm"
                  >
                    <LayoutDashboard size={16} />
                    {user.role === "admin" ? "Panel Admin" : "Mi Dashboard"}
                  </button>

                  {}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm border-t border-[#252D42]"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (

            <>
              <button
                onClick={() => setLocation("/login")}
                className="text-[#6B7494] hover:text-[#EEF0F7] transition-colors font-medium text-sm py-2.5 px-4"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setLocation("/register")}
                className="text-[#6B7494] hover:text-[#EEF0F7] transition-colors font-medium text-sm py-2.5 px-4 border border-[#6B7494] rounded-lg hover:border-[#EEF0F7]"
              >
                Registrarse
              </button>
              <button
                onClick={() => handleNavClick("#contacto")}
                className="btn-primary text-sm py-2.5 px-5"
              >
                Cotizar
              </button>
            </>
          )}
        </div>

        {}
        <button
          className="md:hidden text-[#6B7494] hover:text-[#EEF0F7] transition-colors p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#252D42] mt-3">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-[#6B7494] hover:text-[#EEF0F7] transition-colors font-medium text-base py-1"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {link.label}
              </a>
            ))}

            {user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#252D42]">
                <div className="px-3 py-2 bg-[#00E5A0]/10 border border-[#00E5A0]/30 rounded-lg">
                  <p className="text-xs text-[#6B7494]">Logueado como</p>
                  <p className="text-sm font-medium text-[#00E5A0]">{user.name || user.email}</p>
                  <p className="text-xs text-[#6B7494] mt-1">{user.email}</p>
                </div>
                <button
                  onClick={handleDashboard}
                  className="w-full px-4 py-2 bg-[#00E5A0]/10 border border-[#00E5A0]/30 rounded-lg text-[#00E5A0] hover:bg-[#00E5A0]/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  {user.role === "admin" ? "Panel Admin" : "Mi Dashboard"}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#252D42]">
                <button
                  onClick={() => { setMobileOpen(false); setLocation("/login"); }}
                  className="flex-1 text-[#6B7494] hover:text-[#EEF0F7] transition-colors font-medium text-sm py-2 px-4 border border-[#6B7494] rounded-lg hover:border-[#EEF0F7]"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => { setMobileOpen(false); setLocation("/register"); }}
                  className="flex-1 btn-primary text-sm py-2 px-4"
                >
                  Registrarse
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavClick("#contacto")}
              className="btn-primary text-sm mt-2 w-full"
            >
              Cotizar
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
