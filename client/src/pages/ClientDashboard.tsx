

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function ClientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("quotes");

const { data: myQuotes, isLoading: quotesLoading } = trpc.quotes.getMyQuotes.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: myProjects, isLoading: projectsLoading } = trpc.projects.getMyProjects.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: notifications } = trpc.notifications.getMyNotifications.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Inicia sesión</h1>
          <p className="text-gray-600">Necesitas iniciar sesión para ver tu panel.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
            <p className="text-gray-600 mt-2">Bienvenido, {user.name}</p>
          </div>
          <Button onClick={() => setLocation('/')} variant="outline">
            Volver al Inicio
          </Button>
        </div>

        {}
        {notifications && notifications.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Notificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notif: any) => (
                  <div key={notif.id} className="text-sm text-blue-800">
                    <p className="font-semibold">{notif.title}</p>
                    <p className="text-blue-700">{notif.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mis Cotizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myQuotes?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {myQuotes?.filter((q: any) => q.status === 'pending').length || 0} pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Mis Proyectos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProjects?.length || 0}</div>
              <p className="text-xs text-gray-500 mt-1">
                {myProjects?.filter((p: any) => p.status === 'in-progress').length || 0} en progreso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Proyectos Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myProjects?.filter((p: any) => p.status === 'completed').length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
          </TabsList>

          {}
          <TabsContent value="quotes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Mis Cotizaciones</h2>
              <Button onClick={() => setLocation('/')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cotización
              </Button>
            </div>

            {quotesLoading ? (
              <div className="text-center py-8">Cargando cotizaciones...</div>
            ) : myQuotes && myQuotes.length > 0 ? (
              <div className="space-y-4">
                {myQuotes.map((quote: any) => (
                  <Card key={quote.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{quote.title}</CardTitle>
                          <CardDescription>{quote.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(quote.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(quote.status)}
                            {quote.status}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Precio Estimado</p>
                          <p className="text-lg font-semibold">${quote.estimatedPrice || '0'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha de Solicitud</p>
                          <p className="text-lg font-semibold">
                            {new Date(quote.createdAt).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No tienes cotizaciones aún</p>
                  <Button onClick={() => setLocation('/')} className="mt-4">
                    Solicitar Cotización
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {}
          <TabsContent value="projects" className="space-y-4">
            <h2 className="text-lg font-semibold">Mis Proyectos</h2>

            {projectsLoading ? (
              <div className="text-center py-8">Cargando proyectos...</div>
            ) : myProjects && myProjects.length > 0 ? (
              <div className="space-y-4">
                {myProjects.map((project: any) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{project.title}</CardTitle>
                          <CardDescription>{project.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(project.status)}
                            {project.status}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Prioridad</p>
                          <p className="text-lg font-semibold capitalize">{project.priority}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fecha Límite</p>
                          <p className="text-lg font-semibold">
                            {project.dueDate ? new Date(project.dueDate).toLocaleDateString('es-CO') : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Creado</p>
                          <p className="text-lg font-semibold">
                            {new Date(project.createdAt).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                      </div>

                      {project.status === 'in-progress' && (
                        <Button className="mt-4" variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-600">No tienes proyectos aún</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
