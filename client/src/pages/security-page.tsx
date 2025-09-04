import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Lock, CreditCard, Eye, Server, AlertTriangle, CheckCircle, Key, Database } from "lucide-react";
import aiLogo from "@assets/AI_1756923008802.png";

export default function SecurityPage() {
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
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Seguridad y Protección de Datos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tu seguridad y privacidad son nuestras prioridades principales. Conoce cómo protegemos tu información y garantizamos un acceso seguro a nuestras herramientas ministeriales.
          </p>
        </div>

        {/* Security Overview */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <h2 className="text-xl font-bold text-foreground">Certificación de Seguridad</h2>
            </div>
            <p className="text-center text-muted-foreground mb-4">
              Nuestra plataforma cumple con los más altos estándares de seguridad internacional
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">SSL/TLS Cifrado</Badge>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">OAuth 2.0</Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">PCI DSS Compliant</Badge>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">GDPR Ready</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2 text-primary" />
              Protección de Datos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Cifrado de Datos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Todos los datos se cifran en tránsito usando TLS 1.3
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Información personal cifrada en reposo con AES-256
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Contraseñas protegidas con algoritmos de hash avanzados
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Claves de cifrado administradas de forma segura
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Almacenamiento Seguro</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Servidores en centros de datos certificados
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Respaldos automáticos y cifrados
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Acceso restringido con autenticación multifactor
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Monitoreo 24/7 de la infraestructura
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2 text-chart-2" />
              Seguridad de Autenticación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Sistema OAuth 2.0</h3>
              <p className="text-muted-foreground mb-4">
                Utilizamos el protocolo OAuth 2.0 estándar de la industria para garantizar un acceso seguro a los Custom GPTs.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Autenticación sin exponer credenciales
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Tokens de acceso con expiración automática
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Verificación de identidad en cada acceso
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Revocación inmediata de accesos no autorizados
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Protección de Cuentas</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Detección automática de actividades sospechosas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Límites de intentos de inicio de sesión
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Notificaciones de seguridad por email
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Sesiones seguras con timeouts automáticos
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Payment Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-chart-3" />
              Seguridad de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Procesamiento con Stripe</h3>
              <p className="text-muted-foreground mb-4">
                Todos los pagos son procesados por Stripe, líder mundial en seguridad de pagos digitales.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Certificación PCI DSS Nivel 1 (el más alto)
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  No almacenamos información de tarjetas de crédito
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Tokenización segura de datos de pago
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Detección avanzada de fraudes
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Transacciones Seguras</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Cifrado de extremo a extremo en todas las transacciones
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Verificación en tiempo real de tarjetas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Auditorías regulares de seguridad
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Cumplimiento con regulaciones internacionales
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Platform Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="w-5 h-5 mr-2 text-chart-4" />
              Seguridad de la Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Infraestructura Segura</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Hosting en infraestructura cloud certificada
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Firewalls avanzados y sistemas de detección de intrusos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Actualizaciones automáticas de seguridad
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Monitoreo continuo de vulnerabilidades
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Protección de Aplicaciones</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Código revisado por expertos en seguridad
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Pruebas de penetración regulares
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Protección contra ataques DDoS
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Validación y sanitización de datos de entrada
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Access Control */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-chart-5" />
              Privacidad y Control de Acceso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Privacidad de Conversaciones</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Tus conversaciones con los GPTs son completamente privadas
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  No compartimos contenido con terceros
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Acceso restringido solo a usuarios autorizados
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Política de retención de datos transparente
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Control de Datos</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Derecho a acceder a tu información personal
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Derecho a rectificar datos incorrectos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Derecho a eliminar tu cuenta y datos
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-3 mt-0.5 text-green-500 flex-shrink-0" />
                  Portabilidad de datos cuando sea aplicable
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Incident Response */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Respuesta a Incidentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Contamos con un plan integral de respuesta a incidentes de seguridad para proteger tu información en todo momento.
            </p>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Proceso de Respuesta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Detección</h4>
                  <p className="text-sm text-muted-foreground">Monitoreo 24/7 para identificar amenazas de forma inmediata</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Contención</h4>
                  <p className="text-sm text-muted-foreground">Aislamiento rápido de amenazas para prevenir propagación</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Investigación</h4>
                  <p className="text-sm text-muted-foreground">Análisis forense para determinar el alcance del incidente</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Comunicación</h4>
                  <p className="text-sm text-muted-foreground">Notificación transparente a usuarios afectados</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Certifications */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Certificaciones y Cumplimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-muted/30 rounded-lg p-4">
                <Lock className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-sm">SSL/TLS</h4>
                <p className="text-xs text-muted-foreground">Cifrado en tránsito</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <Key className="w-8 h-8 mx-auto mb-2 text-chart-2" />
                <h4 className="font-semibold text-sm">OAuth 2.0</h4>
                <p className="text-xs text-muted-foreground">Autenticación segura</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <CreditCard className="w-8 h-8 mx-auto mb-2 text-chart-3" />
                <h4 className="font-semibold text-sm">PCI DSS</h4>
                <p className="text-xs text-muted-foreground">Pagos seguros</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <Shield className="w-8 h-8 mx-auto mb-2 text-chart-4" />
                <h4 className="font-semibold text-sm">GDPR Ready</h4>
                <p className="text-xs text-muted-foreground">Protección de datos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Security Team */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-primary/20">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-4">¿Preguntas sobre Seguridad?</h3>
            <p className="text-muted-foreground mb-6">
              Si tienes alguna pregunta sobre nuestras prácticas de seguridad o deseas reportar una vulnerabilidad, contacta a nuestro equipo especializado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@frankiefelicie.net">
                <Button size="lg" className="w-full sm:w-auto">
                  Contactar Equipo de Seguridad
                </Button>
              </a>
              <Link href="/privacy-policy">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Ver Política de Privacidad
                </Button>
              </Link>
            </div>
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