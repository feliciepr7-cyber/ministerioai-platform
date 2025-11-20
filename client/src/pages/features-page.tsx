import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Shield, Zap, Globe, Heart, BookOpen, Users } from "lucide-react";
import aiLogo from "@assets/AI_1756923008802.png";

export default function FeaturesPage() {
  // SEO Configuration for Features Page
  useSEO({
    title: "Características y Funcionalidades - Ministerio AI",
    description: "Descubre las poderosas características de nuestras herramientas de IA para ministerio cristiano. Acceso seguro, de por vida, especializado en español y respaldado teológicamente.",
    keywords: "características ministerio AI, funcionalidades pastor, herramientas AI cristianas, acceso seguro ministerio, GPT cristiano español",
    canonical: "/features",
    ogTitle: "Características Poderosas para el Ministerio - Ministerio AI",
    ogDescription: "Explora todas las características que hacen de nuestros Custom GPTs las herramientas perfectas para tu ministerio cristiano."
  });

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

            {/* Las Epistolas del Apostol Pablo */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Las Epistolas del Apostol Pablo
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Estudio exhaustivo de las 13 cartas paulinas con análisis teológico y aplicación pastoral.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Análisis completo de todas las epistolas paulinas
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Contexto histórico y teológico detallado
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Aplicaciones pastorales modernas
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Doctrina cristiana fundamental explicada
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 text-center">
                    <BookOpen className="w-16 h-16 text-chart-1 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Profundiza en la teología paulina con análisis experto
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estudio El Libro de Apocalipsis */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-red-100 to-purple-100 dark:from-red-900/20 dark:to-purple-900/20 rounded-lg p-6 text-center">
                      <Shield className="w-16 h-16 text-chart-5 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Desentraña los misterios proféticos con claridad y esperanza
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Estudio El Libro de Apocalipsis
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Guía completa para entender el libro más profético de la Biblia.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Análisis detallado de las siete iglesias
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Simbolismo apocalíptico explicado
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Promesas de esperanza para la iglesia
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Interpretación responsable de profecías
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estudio de Cantar de los Cantares */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Estudio de Cantar de los Cantares
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Explora la belleza del amor divino a través del libro más poético de la Biblia.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Múltiples interpretaciones explicadas claramente
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Simbolismo y contexto cultural oriental
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Aplicación para matrimonio cristiano
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Relación Cristo-Iglesia ilustrada
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg p-6 text-center">
                    <Heart className="w-16 h-16 text-chart-5 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Descubre la poesía del amor sagrado y humano
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacitacion Bíblica para Servidores de Ministerio */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-6 text-center">
                      <Users className="w-16 h-16 text-chart-3 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Forma líderes competentes con fundamento bíblico sólido
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Capacitacion Bíblica para Servidores de Ministerio
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Formación integral para desarrollar líderes ministeriales competentes y comprometidos.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Capacitación bíblica estructurada y progresiva
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Formación ministerial práctica
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Herramientas para liderazgo cristiano efectivo
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Desarrollo de competencias ministeriales
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diccionario Bíblico */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Diccionario Bíblico
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Recurso enciclopédico para entender términos, personajes y conceptos bíblicos.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Definiciones bíblicas completas y precisas
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Contexto histórico y cultural detallado
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Referencias cruzadas extensivas
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Etimología y análisis lingüístico
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-6 text-center">
                    <BookOpen className="w-16 h-16 text-chart-4 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Tu biblioteca bíblica digital completa y accesible
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estudios Biblicos Profundos */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-lg p-6 text-center">
                      <BookOpen className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Análisis profundo con metodología académica y aplicación práctica
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Estudios Biblicos Profundos
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Análisis exhaustivo de pasajes bíblicos con metodología académica y aplicación ministerial.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Exégesis rigurosa del texto original
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Contexto histórico y cultural profundo
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Metodología de estudio estructurada
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Aplicaciones prácticas contemporáneas
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* El Antiguo Testamento del Hebreo Original */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      El Antiguo Testamento del Hebreo Original
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Sumérgete en el estudio del AT desde el idioma original con análisis lingüístico avanzado.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Análisis lingüístico del hebreo bíblico
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Matices del idioma original explicados
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Comparación entre traducciones
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Contexto cultural del antiguo Israel
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-6 text-center">
                    <BookOpen className="w-16 h-16 text-blue-700 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Descubre la riqueza del texto en su lengua original
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* El Nuevo Testamento del Griego Original */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-lg p-6 text-center">
                      <BookOpen className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Explora el NT desde el griego koiné con precisión académica
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      El Nuevo Testamento del Griego Original
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Estudio avanzado del NT desde el griego koiné con análisis lingüístico y teológico.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Análisis del griego koiné del primer siglo
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Tiempos verbales y matices semánticos
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Contexto cultural greco-romano
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Crítica textual y variantes manuscritas
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Que Dice la Biblia? */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      ¿Qué Dice la Biblia?
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Respuestas bíblicas claras y directas a las preguntas cotidianas de la vida cristiana.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Respuestas fundamentadas en las Escrituras
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Múltiples referencias bíblicas relevantes
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Aplicación práctica a la vida diaria
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Orientación pastoral equilibrada
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-lime-100 dark:from-green-900/20 dark:to-lime-900/20 rounded-lg p-6 text-center">
                    <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Encuentra lo que la Biblia dice sobre cualquier tema
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capacitacion Practica en la Fe */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <div className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg p-6 text-center">
                      <Heart className="w-16 h-16 text-rose-600 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Herramientas prácticas para vivir la fe día a día
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                      Capacitación Práctica en la Fe
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Formación práctica para vivir la fe cristiana auténticamente en el día a día.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Disciplinas espirituales diarias
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Vida de santidad y carácter cristiano
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Testimonio y evangelismo personal
                      </li>
                      <li className="flex items-center text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-chart-2 mr-2 flex-shrink-0" />
                        Crecimiento en los frutos del Espíritu
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
            <Link href="/support">
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