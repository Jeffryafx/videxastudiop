import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, Edit2, Plus, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    basePrice: "",
    icon: "",
    category: "",
    features: [] as string[],
  });

  const servicesQuery = trpc.services.list.useQuery();
  const services = servicesQuery.data || [];

  const createMutation = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Servicio creado exitosamente");
      servicesQuery.refetch();
      resetForm();
    },
    onError: (err) => {
      toast.error(err.message || "Error al crear servicio");
    },
  });

  const updateMutation = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Servicio actualizado exitosamente");
      servicesQuery.refetch();
      resetForm();
    },
    onError: (err) => {
      toast.error(err.message || "Error al actualizar servicio");
    },
  });

  const deleteMutation = trpc.services.delete.useMutation({
    onSuccess: () => {
      toast.success("Servicio eliminado exitosamente");
      servicesQuery.refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Error al eliminar servicio");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      basePrice: "",
      icon: "",
      category: "",
      features: [],
    });
    setNewFeature("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.basePrice || !formData.category) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const featuresString = formData.features.join(",");
    console.log("Enviando features:", { features: formData.features, featuresString });

    if (editingId) {
      console.log("Actualizando con:", {
        id: editingId,
        name: formData.name,
        description: formData.description,
        basePrice: formData.basePrice,
        icon: formData.icon,
        category: formData.category,
        features: featuresString,
      });
      
      updateMutation.mutate({
        id: editingId,
        name: formData.name || undefined,
        description: formData.description || undefined,
        basePrice: formData.basePrice,
        icon: formData.icon || undefined,
        category: formData.category || undefined,
        features: featuresString || undefined,
      });
    } else {
      createMutation.mutate({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        basePrice: formData.basePrice,
        icon: formData.icon,
        category: formData.category,
        features: featuresString,
      });
    }
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || "",
      basePrice: service.basePrice,
      icon: service.icon || "",
      category: service.category,
      features: service.features ? service.features.split(",").map((f: string) => f.trim()) : [],
    });
    setNewFeature("");
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
      deleteMutation.mutate({ id });
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Servicios</CardTitle>
            <CardDescription>Gestiona los servicios disponibles y sus precios</CardDescription>
          </div>
          <Button
            onClick={() => {
              if (!showForm) {
                resetForm();
                setShowForm(true);
              }
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Servicio
          </Button>
        </CardHeader>

        {showForm && (
          <div className="border-t px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Nombre</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Motion Graphics"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Slug</label>
                  <Input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="motion-graphics"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Precio Base ($)</label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    placeholder="25.00"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Categoría</label>
                  <Input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="motion-edit"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe brevemente el servicio"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Features</label>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    placeholder="Ej: Animaciones 2D/3D"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addFeature}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-100 text-blue-800 flex items-center gap-2 py-2 px-3"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : editingId ? (
                    "Actualizar Servicio"
                  ) : (
                    "Crear Servicio"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        <CardContent className="pt-6">
          {servicesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : services.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Features</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoría</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service: any) => (
                    <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{service.name}</td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{service.description || "-"}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-green-600">${parseFloat(service.basePrice).toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{service.category}</td>
                      <td className="py-3 px-4">
                        <Badge className={service.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {service.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="p-2 hover:bg-blue-50 rounded-md text-blue-600 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 hover:bg-red-50 rounded-md text-red-600 transition-colors"
                            disabled={deleteMutation.isPending}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay servicios aún. Crea el primero usando el botón "Nuevo Servicio".
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
