import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Shield, Zap, Globe, Heart, BookOpen, Users } from "lucide-react";
import aiLogo from "@assets/AI_1756923008802.png";

export default function FeaturesPage() {
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

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Características Poderosas para el Ministerio
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre todas las características que hacen de nuestros Custom GPTs las herramientas perfectas para tu ministerio cristiano.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Acceso Seguro</h3>
              <p className="text-muted-foreground">
                Sistema de autenticación OAuth seguro que protege tu acceso y garantiza que solo usuarios autorizados puedan usar los GPTs.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-chart-2" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Acceso de Por Vida</h3>
              <p className="text-muted-foreground">
                Una sola compra te da acceso permanente. Sin suscripciones mensuales, sin renovaciones. Compra una vez, úsalo para siempre.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Especializado en Español</h3>
              <p className="text-muted-foreground">
                Diseñado específicamente para el ministerio de habla hispana, con comprensión cultural y teológica profunda.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-chart-4" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Base Bíblica Sólida</h3>
              <p className="text-muted-foreground">
                Todos los contenidos están fundamentados en las Escrituras, manteniendo la ortodoxia doctrinal y la fidelidad bíblica.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-chart-5" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Enfoque Pastoral</h3>
              <p className="text-muted-foreground">
                Desarrollado con sensibilidad pastoral, considerando las necesidades reales de pastores y líderes ministeriales.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Soporte Dedicado</h3>
              <p className="text-muted-foreground">
                Equipo de soporte especializado disponible para ayudarte con cualquier pregunta o dificultad técnica.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* GPT-Specific Features */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8 sm:mb-12">
            Características Específicas por GPT
          </h2>
          
          <div className="space-y-8 sm:space-y-12">
            {/* Generador de Sermones */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Generador de Sermones
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Herramienta especializada para la preparación de sermones con base bíblica sólida.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Bosquejos detallados basados en pasajes específicos
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Aplicaciones prácticas para la congregación
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Ilustraciones y ejemplos contextualizados
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Estructura homilética clara y efectiva
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 text-center">
                    <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Transforma tu preparación sermonal con IA especializada
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual de Ceremonias */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 text-center">
                      <Heart className="w-16 h-16 text-chart-2 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Guía completa para todos los momentos especiales del ministerio
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Manual de Ceremonias del Ministro
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Tu asistente para ceremonias y eventos especiales con excelencia ministerial.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Guías paso a paso para bodas, funerales y dedicaciones
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Protocolos ceremoniosos apropiados
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Liturgias y oraciones para cada ocasión
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Consejos para manejar situaciones especiales
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mensajes Expositivos */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Mensajes Expositivos
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Especialista en predicación expositiva fiel al texto bíblico.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Análisis exegético profundo de pasajes bíblicos
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Contexto histórico y cultural detallado
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Aplicación contemporánea clara y relevante
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Metodología expositiva paso a paso
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 text-center">
                    <Shield className="w-16 h-16 text-chart-3 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Predicación expositiva con fidelidad bíblica y relevancia actual
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comentario Exegético */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 text-center">
                      <BookOpen className="w-16 h-16 text-chart-4 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Análisis académico profundo para una interpretación bíblica precisa
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Comentario Exegético
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Análisis profundo y académico de textos bíblicos con rigor teológico.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Análisis exegético detallado de cualquier pasaje
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Contexto histórico, cultural y lingüístico
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Interpretación teológica rigurosa y académica
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Referencias a comentarios bíblicos reconocidos
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security & Privacy */}
        <Card className="mb-12 sm:mb-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-primary/20">
          <CardContent className="p-6 sm:p-8 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
              Seguridad y Privacidad Garantizadas
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              Tu información y conversaciones están protegidas con los más altos estándares de seguridad. 
              Utilizamos autenticación OAuth y cifrado de extremo a extremo para garantizar tu privacidad.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center text-muted-foreground">
                <Check className="w-4 h-4 text-chart-2 mr-2" />
                Autenticación OAuth
              </div>
              <div className="flex items-center justify-center text-muted-foreground">
                <Check className="w-4 h-4 text-chart-2 mr-2" />
                Cifrado SSL/TLS
              </div>
              <div className="flex items-center justify-center text-muted-foreground">
                <Check className="w-4 h-4 text-chart-2 mr-2" />
                Datos Protegidos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            ¿Listo para Transformar tu Ministerio?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Únete a pastores y líderes que ya están utilizando nuestras herramientas de IA para llevar su ministerio al siguiente nivel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                Ver Precios
              </Button>
            </Link>
            <Link href="https://frankiefelicie.net/support-client/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contactar Soporte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}