import { useRoute } from "wouter";
import { Loader2, ArrowLeft, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BlogArticle() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;

  const { data: article, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-[#00E5A0]" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Artículo no encontrado</h1>
          <p className="text-gray-400 mb-6">El artículo que buscas no existe o fue eliminado.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#00E5A0] to-[#22D3EE] text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/">
          <Button
            variant="outline"
            className="mb-8 border-gray-700 text-gray-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <article className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{article.readingTime} min lectura</span>
              </div>
              <span className="text-sm bg-gray-700 px-3 py-1 rounded-full">
                {article.category}
              </span>
              {article.publishedAt && (
                <time dateTime={article.publishedAt.toString()}>
                  {new Date(article.publishedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
          </div>

          {article.excerpt && (
            <p className="text-lg text-gray-300 mb-8 pb-8 border-b border-gray-700">
              {article.excerpt}
            </p>
          )}

          <div
            className="prose prose-invert max-w-full text-gray-300"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }}
          />
        </article>
      </div>
    </div>
  );
}
