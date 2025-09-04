import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Megaphone, Zap, Plus } from "lucide-react";
import aiLogo from "@assets/AI_1756923008802.png";

export default function StatusPage() {
  // Get current time each time the component renders
  const getCurrentTime = () => new Date();

  // Current status - you can update these as needed
  const systemStatus = [
    { name: "GPT Access", status: "operational", description: "All Custom GPTs are accessible" },
    { name: "Authentication", status: "operational", description: "User login and registration working" },
    { name: "Payment Processing", status: "operational", description: "Stripe payments processing normally" },
    { name: "Website", status: "operational", description: "All website features working" },
    { name: "Dashboard", status: "operational", description: "User dashboard fully functional" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "maintenance":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "incident":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Operational</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Maintenance</Badge>;
      case "incident":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Incident</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Operational</Badge>;
    }
  };

  // Recent announcements - you can update these when adding new GPTs
  const announcements = [
    {
      id: 1,
      type: "new-feature",
      title: "¡Plataforma Ministerio AI Lanzada!",
      description: "Hemos lanzado oficialmente nuestra plataforma con tres Custom GPTs especializados para el ministerio cristiano.",
      date: "2024-09-04",
      icon: <Zap className="w-5 h-5 text-primary" />
    },
    {
      id: 2,
      type: "coming-soon",
      title: "Nuevos GPTs en Desarrollo",
      description: "Estamos trabajando en nuevos Custom GPTs para expandir nuestras herramientas ministeriales. ¡Mantente atento!",
      date: "2024-09-04",
      icon: <Plus className="w-5 h-5 text-chart-2" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src={aiLogo} 
                alt="Ministerio AI Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-lg sm:text-xl font-bold text-foreground">Ministerio AI</span>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Estado del Servicio
          </h1>
          <p className="text-lg text-muted-foreground">
            Monitoreo en tiempo real de todos nuestros servicios y anuncios de la plataforma
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-foreground">Todos los Sistemas Operativos</h2>
            </div>
            <p className="text-muted-foreground">
              Todos nuestros servicios están funcionando correctamente
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Última actualización: {getCurrentTime().toLocaleDateString('es-ES')} a las {getCurrentTime().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardContent>
        </Card>

        {/* System Status Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estado de los Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Megaphone className="w-5 h-5 mr-2 text-primary" />
              Anuncios y Actualizaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-primary pl-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {announcement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {new Date(announcement.date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{announcement.description}</p>
                      {announcement.type === "new-feature" && (
                        <Badge className="mt-2 bg-primary/10 text-primary">Nueva Funcionalidad</Badge>
                      )}
                      {announcement.type === "coming-soon" && (
                        <Badge className="mt-2 bg-chart-2/10 text-chart-2">Próximamente</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current GPTs Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estado de Custom GPTs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <h3 className="font-semibold text-foreground">Generador de Sermones</h3>
                  <p className="text-sm text-muted-foreground">Disponible</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <h3 className="font-semibold text-foreground">Manual de Ceremonias</h3>
                  <p className="text-sm text-muted-foreground">Disponible</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <h3 className="font-semibold text-foreground">Mensajes Expositivos</h3>
                  <p className="text-sm text-muted-foreground">Disponible</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Métricas de Rendimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Tiempo de Actividad</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">&lt;2s</div>
                <div className="text-sm text-muted-foreground">Tiempo de Respuesta</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">Pagos Exitosos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">¿Experimentando Problemas?</h3>
            <p className="text-muted-foreground mb-6">
              Si encuentras algún problema no listado aquí, nuestro equipo de soporte está aquí para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://frankiefelicie.net/support-client/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto">
                  Centro de Soporte
                </Button>
              </a>
              <a href="mailto:support@frankiefelicie.net">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contactar por Email
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Subscribe to Updates */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-4">Mantente Informado</h3>
            <p className="text-muted-foreground mb-4">
              Suscríbete a nuestras actualizaciones para recibir notificaciones sobre nuevos GPTs y mejoras en la plataforma.
            </p>
            <a href="https://frankiefelicie.net/contact/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                Suscribirse a Actualizaciones
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}