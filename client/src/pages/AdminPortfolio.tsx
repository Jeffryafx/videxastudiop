import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminPortfolio() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "reel",
    duration: "60s",
    thumbnailUrl: "",
    videoUrl: "",
    clientName: "",
    isPublic: false,
  });

  const items = trpc.portfolio.getPublic.useQuery();
  const createItem = trpc.portfolio.create.useMutation({
    onSuccess: () => {
      toast.success("Proyecto agregado al portafolio");
      items.refetch();
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al crear");
    },
  });

  const updateItem = trpc.portfolio.update.useMutation({
    onSuccess: () => {
      toast.success("Proyecto actualizado");
      items.refetch();
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al actualizar");
    },
  });

  const deleteItem = trpc.portfolio.delete.useMutation({
    onSuccess: () => {
      toast.success("Proyecto eliminado");
      items.refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al eliminar");
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "reel",
      duration: "60s",
      thumbnailUrl: "",
      videoUrl: "",
      clientName: "",
      isPublic: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.videoUrl) {
      toast.error("Completa los campos requeridos");
      return;
    }

    if (editingId) {
      updateItem.mutate({ id: editingId, ...formData });
    } else {
      createItem.mutate(formData as any);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      description: item.description || "",
      category: item.category,
      duration: item.duration || "60s",
      thumbnailUrl: item.thumbnailUrl || "",
      videoUrl: item.videoUrl,
      clientName: item.clientName || "",
      isPublic: item.isPublic,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
          <p className="text-gray-400 mt-1">Gestiona videos y proyectos del portafolio</p>
        </div>
        <Button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-gradient-to-r from-[#00E5A0] to-[#22D3EE] text-gray-900"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cancelar" : "Agregar Proyecto"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-gray-700 bg-gray-900/50">
          <CardHeader>
            <CardTitle>{editingId ? "Editar" : "Agregar"} Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nombre del proyecto"
                    className="bg-gray-800 border-gray-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Cliente</label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Nombre del cliente"
                    className="bg-gray-800 border-gray-700 text-white"
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
                    <option value="reel">Reel</option>
                    <option value="motion-graphics">Motion Graphics</option>
                    <option value="brand-pack">Brand Pack</option>
                    <option value="captions">Captions</option>
                    <option value="promo">Promo</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Duración</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="60s, 30s, etc"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del proyecto"
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">URL del Video (S3 o YouTube)</label>
                <Input
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">URL de Thumbnail (S3)</label>
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-300">Mostrar en portafolio público</label>
              </div>

              <Button
                type="submit"
                disabled={createItem.isPending || updateItem.isPending}
                className="w-full bg-gradient-to-r from-[#00E5A0] to-[#22D3EE] text-gray-900"
              >
                {createItem.isPending || updateItem.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  editingId ? "Actualizar" : "Agregar Proyecto"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.isLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#00E5A0]" />
          </div>
        ) : items.data?.length === 0 ? (
          <Card className="col-span-full border-gray-700 bg-gray-900/50">
            <CardContent className="py-8 text-center text-gray-400">
              No hay proyectos en el portafolio. Agrega uno para comenzar.
            </CardContent>
          </Card>
        ) : (
          items.data?.map((item) => (
            <Card key={item.id} className="border-gray-700 bg-gray-900/50 overflow-hidden">
              {item.thumbnailUrl && (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardContent className="py-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">
                      {item.category} • {item.duration} {item.clientName && `• ${item.clientName}`}
                    </p>
                  </div>
                  {item.isPublic ? (
                    <Eye className="w-4 h-4 text-[#00E5A0]" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                    className="flex-1 border-gray-600 text-gray-300 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteItem.mutate({ id: item.id })}
                    className="flex-1 border-red-600 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
