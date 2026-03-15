

import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function BlogSection() {
  const { data: articles, isLoading } = trpc.blog.list.useQuery();

  if (isLoading) {
    return (
      <section
        id="blog"
        className="relative py-24 overflow-hidden flex items-center justify-center"
        style={{ background: "#0E1220", minHeight: "400px" }}
      >
        <Loader2 className="w-8 h-8 animate-spin text-[#00E5A0]" />
      </section>
    );
  }

  const displayArticles = articles?.slice(0, 3) || [];

  return (
    <section
      id="blog"
      className="relative py-24 overflow-hidden"
      style={{ background: "#0E1220" }}
    >
      <div className="container relative z-10">
        {}
        <div className="flex items-end justify-between mb-12 reveal">
          <div>
            <span className="section-label block mb-3">Conocimiento</span>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                color: "#EEF0F7",
                letterSpacing: "-0.01em",
              }}
            >
              Blog
            </h2>
          </div>
          <a
            href="#"
            className="hidden md:flex items-center gap-2 text-[#00E5A0] text-sm font-semibold hover:gap-3 transition-all duration-200"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            onClick={(e) => e.preventDefault()}
          >
            Ver todos <ArrowRight size={16} />
          </a>
        </div>

        {}
        <div className="grid md:grid-cols-3 gap-6">
          {displayArticles.map((article, index) => {
            const categoryColors: Record<string, string> = {
              Tutorial: "#7C5CFC",
              Tendencias: "#00E5A0",
              Negocio: "#22D3EE",
              Tips: "#FF6B6B",
            };

            const categoryColor = categoryColors[article.category] || "#00E5A0";

            return (
              <article
                key={article.id}
                className="reveal service-card flex flex-col gap-4 group cursor-pointer"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                {}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: categoryColor }}
                  >
                    {article.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                        })
                      : ""}
                  </span>
                </div>

                {}
                <h3
                  className="text-lg font-semibold text-white group-hover:text-[#00E5A0] transition-colors duration-200"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {article.title}
                </h3>

                {}
                <p className="text-sm text-gray-400 flex-grow">
                  {article.excerpt || article.content.substring(0, 100)}
                </p>

                {}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} />
                    {article.readingTime} min
                  </div>
                  <a
                    href={`/blog/${article.slug}`}
                    className="text-xs font-semibold text-[#00E5A0] hover:gap-2 transition-all duration-200 flex items-center gap-1"
                  >
                    Leer más <ArrowRight size={12} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {displayArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No hay artículos publicados aún</p>
          </div>
        )}
      </div>
    </section>
  );
}
