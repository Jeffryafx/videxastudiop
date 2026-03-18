

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Clock, AlertCircle, DollarSign, Loader2, LogOut, BookOpen, Package } from "lucide-react";
import AdminBlog from "./AdminBlog";
import AdminServices from "./AdminServices";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("quotes");

  console.log('[AdminDashboard] User info:', { user, loading: authLoading, role: user?.role });

const { data: quotes, isLoading: quotesLoading, refetch: refetchQuotes } = trpc.quotes.list.useQuery(undefined, {
    enabled: user?.role === "admin" && !authLoading,
  });

  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery(undefined, {
    enabled: user?.role === "admin" && !authLoading,
  });

const updateQuoteStatus = trpc.quotes.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Estado actualizado");
      refetchQuotes();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const updateProjectStatus = trpc.projects.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Estado del proyecto actualizado");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

console.log('[AdminDashboard] Validando acceso:', { role: user?.role, isAdmin: user?.role === "admin" });

  if (!user) {
    console.log('[AdminDashboard] Usuario no autenticado');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Inicia sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Necesitas estar autenticado para acceder.</p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    console.log('[AdminDashboard] Usuario sin permisos admin:', user.role);
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Acceso denegado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">No tienes permisos para acceder al panel de administración.</p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Pendiente",
      approved: "Aprobada",
      rejected: "Rechazada",
      completed: "Completada",
      "in-progress": "En progreso",
      "on-hold": "En espera",
      cancelled: "Cancelada",
    };
    return labels[status] || status;
  };

  const pendingQuotes = quotes?.filter((q: any) => q.status === "pending").length || 0;
  const approvedQuotes = quotes?.filter((q: any) => q.status === "approved").length || 0;
  const completedQuotes = quotes?.filter((q: any) => q.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-sm text-gray-600">Bienvenido, {user?.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cotizaciones Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingQuotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cotizaciones Aprobadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{approvedQuotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Proyectos Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedQuotes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total de Cotizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{quotes?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Servicios
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Blog
            </TabsTrigger>
          </TabsList>

          {}
          <TabsContent value="quotes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cotizaciones</CardTitle>
                <CardDescription>Gestiona todas las cotizaciones de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : quotes && quotes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Servicio</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Descripción</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((quote: any) => (
                          <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{quote.title}</div>
                                <div className="text-xs text-gray-500">ID: {quote.id}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {quote.serviceId === 1 && "Motion Graphics"}
                              {quote.serviceId === 2 && "Edición de Video"}
                              {quote.serviceId === 3 && "Animación 3D"}
                              {quote.serviceId === 4 && "Color Grading"}
                            </td>
                            <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                              {quote.description || "-"}
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(quote.status)}>
                                {getStatusLabel(quote.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={quote.status}
                                onValueChange={(newStatus) => {
                                  updateQuoteStatus.mutate({
                                    id: quote.id,
                                    status: newStatus as any,
                                  });
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="approved">Aprobada</SelectItem>
                                  <SelectItem value="rejected">Rechazada</SelectItem>
                                  <SelectItem value="completed">Completada</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay cotizaciones aún
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Proyectos</CardTitle>
                <CardDescription>Gestiona todos los proyectos en progreso</CardDescription>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : projects && projects.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Proyecto</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Progreso</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((project: any) => (
                          <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-gray-900">{project.title}</div>
                                <div className="text-xs text-gray-500">ID: {project.id}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">Cliente #{project.clientId}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(project.status)}>
                                {getStatusLabel(project.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `50%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600">50%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Select
                                value={project.status}
                                onValueChange={(newStatus) => {
                                  updateProjectStatus.mutate({
                                    id: project.id,
                                    status: newStatus as any,
                                  });
                                }}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="in-progress">En Progreso</SelectItem>
                                  <SelectItem value="completed">Completado</SelectItem>
                                  <SelectItem value="on-hold">En Espera</SelectItem>
                                  <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay proyectos aún
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <AdminServices />
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <AdminBlog />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
