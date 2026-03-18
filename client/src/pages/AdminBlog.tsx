import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminBlog() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "Tutorial",
    excerpt: "",
    content: "",
    readingTime: 5,
    isPublished: false,
  });

  const articles = trpc.blog.getAll.useQuery();
  const createArticle = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Artículo creado exitosamente");
      articles.refetch();
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al crear artículo");
    },
  });

  const updateArticle = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("Artículo actualizado");
      articles.refetch();
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al actualizar");
    },
  });

  const deleteArticle = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("Artículo eliminado");
      articles.refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al eliminar");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      category: "Tutorial",
      excerpt: "",
      content: "",
      readingTime: 5,
      isPublished: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      toast.error("Completa los campos requeridos");
      return;
    }

    if (editingId) {
      updateArticle.mutate({ id: editingId, ...formData });
    } else {
      createArticle.mutate(formData);
    }
  };

  const handleEdit = (article: any) => {
    setFormData({
      title: article.title,
      slug: article.slug,
      category: article.category,
      excerpt: article.excerpt || "",
      content: article.content,
      readingTime: article.readingTime || 5,
      isPublished: article.isPublished,
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Management</h1>
          <p className="text-gray-400 mt-1">Crea y edita artículos del blog</p>
        </div>
        <Button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-gradient-to-r from-[#00E5A0] to-[#22D3EE] text-gray-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancelar" : "Nuevo Artículo"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-gray-700 bg-gray-900/50">
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Crear"} Artículo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título del artículo"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="titulo-del-articulo"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                  >
                    <option>Tutorial</option>
                    <option>Tendencias</option>
                    <option>Negocio</option>
                    <option>Tips</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Tiempo de lectura (min)</label>
                  <Input
                    type="number"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value) })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Extracto</label>
                <Input
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Breve descripción del artículo"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Contenido</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenido del artículo"
                  className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-300">Publicar ahora</label>
              </div>

              <Button
                type="submit"
                disabled={createArticle.isPending || updateArticle.isPending}
                className="w-full bg-gradient-to-r from-[#00E5A0] to-[#22D3EE] text-gray-900"
              >
                {createArticle.isPending || updateArticle.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingId ? "Actualizar" : "Crear Artículo"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {}
      <div className="space-y-3">
        {articles.isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#00E5A0]" />
          </div>
        ) : articles.data?.length === 0 ? (
          <Card className="border-gray-700 bg-gray-900/50">
            <CardContent className="py-8 text-center text-gray-400">
              No hay artículos aún. Crea uno para comenzar.
            </CardContent>
          </Card>
        ) : (
          articles.data?.map((article: any) => (
            <Card key={article.id} className="border-gray-700 bg-gray-900/50">
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                      {article.isPublished ? (
                        <Eye className="w-4 h-4 text-[#00E5A0]" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {article.category} • {article.readingTime} min • {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("es-ES") : "Borrador"}
                    </p>
                    <p className="text-sm text-gray-300 mt-2 line-clamp-2">{article.excerpt || article.content.substring(0, 100)}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(article)}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteArticle.mutate({ id: article.id })}
                      className="border-red-600 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
