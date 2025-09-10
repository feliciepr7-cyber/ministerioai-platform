import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlayCircle, BookOpen, Heart, Shield, MessageSquare, ChevronRight } from "lucide-react";
import aiLogo from "@assets/AI_1756923008802.png";

export default function UserGuidePage() {
  // SEO Configuration for User Guide Page
  useSEO({
    title: "Guía del Usuario - Ministerio AI",
    description: "Aprende a aprovechar al máximo tus herramientas de IA ministerial. Guía completa desde la compra hasta el uso avanzado de cada Custom GPT para pastores y líderes cristianos.",
    keywords: "guía usuario ministerio AI, tutorial pastor AI, como usar GPT cristiano, manual herramientas ministerio, instrucciones AI iglesia",
    canonical: "/user-guide",
    ogTitle: "Guía Completa del Usuario - Ministerio AI",
    ogDescription: "Domina tus herramientas ministeriales con nuestra guía paso a paso para pastores y líderes cristianos."
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

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Guía del Usuario
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprende a aprovechar al máximo tus herramientas de IA ministerial. Esta guía te llevará paso a paso desde la compra hasta el uso avanzado de cada Custom GPT.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlayCircle className="w-5 h-5 mr-2 text-primary" />
              Inicio Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Crear Cuenta</h3>
                <p className="text-sm text-muted-foreground">Regístrate en la plataforma y verifica tu email</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Comprar Acceso</h3>
                <p className="text-sm text-muted-foreground">Selecciona y compra los GPTs que necesitas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Empezar a Usar</h3>
                <p className="text-sm text-muted-foreground">Accede a tus GPTs desde el dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Primeros Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">1. Crear tu Cuenta</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Haz clic en "Get Started" en la página principal
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Completa el formulario de registro con tu información
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Verifica tu email haciendo clic en el enlace que recibirás
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">2. Comprar Acceso a los GPTs</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Selecciona el GPT que deseas comprar ($20 USD cada uno)
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Completa la información de pago de forma segura con Stripe
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Recibirás acceso inmediato después del pago exitoso
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">3. Acceder a tus GPTs</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Ve a tu Dashboard para ver todos tus GPTs disponibles
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Haz clic en "Access GPT" para abrir el Custom GPT en ChatGPT
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                  Serás autenticado automáticamente y podrás empezar a usar la herramienta
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* GPT Guides */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Guías por GPT</h2>
          
          {/* Generador de Sermones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                Generador de Sermones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Esta herramienta te ayuda a crear sermones poderosos y bíblicamente fundamentados.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Cómo empezar:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Proporciona el pasaje bíblico que quieres predicar</li>
                    <li>• Especifica el tema o enfoque principal</li>
                    <li>• Indica la duración deseada del sermón</li>
                    <li>• Menciona el tipo de audiencia (jóvenes, adultos, mixta)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ejemplos de prompts efectivos:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Ejemplo 1:</strong></p>
                    <p className="italic">"Necesito un sermón de 25 minutos sobre Juan 3:16 enfocado en el amor de Dios para una congregación adulta."</p>
                    
                    <p className="mb-2 mt-4"><strong>Ejemplo 2:</strong></p>
                    <p className="italic">"Ayúdame a preparar un mensaje sobre el perdón basado en Mateo 6:14-15 para jóvenes."</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Qué recibirás:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Bosquejo estructurado con introducción, puntos principales y conclusión</li>
                    <li>• Aplicaciones prácticas para la vida diaria</li>
                    <li>• Ilustraciones y ejemplos relevantes</li>
                    <li>• Referencias bíblicas adicionales de apoyo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual de Ceremonias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-chart-2" />
                Manual de Ceremonias del Ministro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Tu asistente para ceremonias especiales con protocolos apropiados y sensibilidad pastoral.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Tipos de ceremonias cubiertas:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Bodas cristianas</li>
                    <li>• Servicios funerales</li>
                    <li>• Dedicación de niños</li>
                    <li>• Bautismos</li>
                    <li>• Ceremonias de graduación</li>
                    <li>• Servicios especiales</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ejemplos de consultas:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Para bodas:</strong></p>
                    <p className="italic">"Necesito el protocolo completo para una boda cristiana, incluyendo votos y bendiciones."</p>
                    
                    <p className="mb-2 mt-4"><strong>Para funerales:</strong></p>
                    <p className="italic">"Ayúdame a preparar un servicio funeral apropiado para un joven creyente."</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Lo que incluye:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Guiones paso a paso para cada ceremonia</li>
                    <li>• Oraciones y bendiciones apropiadas</li>
                    <li>• Consejos para manejar situaciones especiales</li>
                    <li>• Protocolos y etiqueta ministerial</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mensajes Expositivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-chart-3" />
                Mensajes Expositivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Especialista en predicación expositiva que mantiene la fidelidad al texto bíblico.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Proceso de predicación expositiva:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Análisis del texto en su contexto original</li>
                    <li>• Explicación del significado histórico</li>
                    <li>• Aplicación contemporánea relevante</li>
                    <li>• Estructura expositiva clara</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cómo usar efectivamente:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Paso 1:</strong> Proporciona el pasaje específico</p>
                    <p className="mb-2"><strong>Paso 2:</strong> Solicita análisis exegético</p>
                    <p className="mb-2"><strong>Paso 3:</strong> Pide aplicaciones prácticas</p>
                    <p><strong>Paso 4:</strong> Revisa la estructura del mensaje</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ejemplo de consulta:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="italic">"Ayúdame a hacer una exposición de Efesios 2:8-10. Necesito el contexto histórico, el significado original y cómo aplicarlo hoy."</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comentario Exegético */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-chart-4" />
                Comentario Exegético
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Herramienta especializada en análisis exegético profundo y académico de textos bíblicos.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Áreas de análisis:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Exégesis detallada de cualquier pasaje bíblico</li>
                    <li>• Contexto histórico y cultural del texto</li>
                    <li>• Análisis lingüístico en idiomas originales</li>
                    <li>• Comparación con diferentes traducciones</li>
                    <li>• Referencias teológicas y académicas</li>
                    <li>• Aplicación hermenéutica rigurosa</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Cómo obtener mejores resultados:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Paso 1:</strong> Especifica el pasaje exacto que deseas analizar</p>
                    <p className="mb-2"><strong>Paso 2:</strong> Indica el tipo de análisis (exegético, teológico, cultural)</p>
                    <p className="mb-2"><strong>Paso 3:</strong> Menciona si necesitas referencias académicas específicas</p>
                    <p><strong>Paso 4:</strong> Solicita aclaraciones sobre puntos complejos</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ejemplos de consultas efectivas:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Análisis completo:</strong></p>
                    <p className="italic mb-3">"Necesito un análisis exegético completo de Romanos 3:23-24. Incluye contexto histórico, significado original en griego y implicaciones teológicas."</p>
                    
                    <p className="mb-2"><strong>Comparación textual:</strong></p>
                    <p className="italic">"Compara las diferentes interpretaciones de 1 Corintios 7:14 y explica las variantes textuales principales."</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Lo que recibirás:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Análisis verso por verso del pasaje seleccionado</li>
                    <li>• Explicación del contexto bíblico e histórico</li>
                    <li>• Interpretación académica y teológica</li>
                    <li>• Referencias a comentarios bíblicos reconocidos</li>
                    <li>• Aplicaciones prácticas fundamentadas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Las Epistolas del Apostol Pablo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-chart-3" />
                Las Epistolas del Apostol Pablo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Sumérgete en el corazón de la teología cristiana con un estudio exhaustivo de las 13 cartas paulinas.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Epístolas cubiertas:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground grid grid-cols-2 gap-1">
                    <li>• Romanos</li>
                    <li>• 1 Corintios</li>
                    <li>• 2 Corintios</li>
                    <li>• Gálatas</li>
                    <li>• Efesios</li>
                    <li>• Filipenses</li>
                    <li>• Colosenses</li>
                    <li>• 1 Tesalonicenses</li>
                    <li>• 2 Tesalonicenses</li>
                    <li>• 1 Timoteo</li>
                    <li>• 2 Timoteo</li>
                    <li>• Tito</li>
                    <li>• Filemón</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ejemplos de consulta:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Estudio temático:</strong></p>
                    <p className="italic mb-3">"Explícame la doctrina de la justificación por fe en Romanos y Gálatas"</p>
                    
                    <p className="mb-2"><strong>Análisis de pasaje:</strong></p>
                    <p className="italic">"Ayúdame a entender Efesios 2:8-10 y su contexto en toda la carta"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estudio El Libro de Apocalipsis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-orange-500" />
                Estudio El Libro de Apocalipsis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Desentraña los misterios del libro más profético y simbólico de la Biblia con claridad y esperanza.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Áreas de estudio:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Las siete iglesias de Asia (Apocalipsis 2-3)</li>
                    <li>• Los siete sellos, trompetas y copas</li>
                    <li>• Simbolismo apocalíptico y su interpretación</li>
                    <li>• La gran tribulación y eventos finales</li>
                    <li>• La Nueva Jerusalén y el reino eterno</li>
                    <li>• Aplicaciones de esperanza para hoy</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Enfoques de interpretación:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Simbolismo:</strong> "¿Qué representa la bestia de Apocalipsis 13?"</p>
                    <p className="mb-2"><strong>Cronología:</strong> "Explica la secuencia de eventos en los últimos tiempos"</p>
                    <p><strong>Aplicación:</strong> "¿Cómo consolará Apocalipsis 21 a alguien que sufre?"</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Lo que recibirás:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Explicación clara de símbolos complejos</li>
                    <li>• Contexto histórico del primer siglo</li>
                    <li>• Múltiples perspectivas interpretativas</li>
                    <li>• Aplicaciones prácticas para la predicación</li>
                    <li>• Mensajes de esperanza y victoria final</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estudio de Cantar de los Cantares */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                Estudio de Cantar de los Cantares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Explora la belleza del amor divino a través del libro más poético de la Biblia.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">Niveles de interpretación:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• <strong>Literal:</strong> Celebración del amor conyugal</li>
                    <li>• <strong>Alegórica:</strong> Relación Cristo-Iglesia</li>
                    <li>• <strong>Espiritual:</strong> Intimidad del alma con Dios</li>
                    <li>• <strong>Pastoral:</strong> Enseñanza sobre matrimonio cristiano</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Temas para explorar:</h4>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm">
                    <p className="mb-2"><strong>Matrimonio:</strong> "¿Cómo usar Cantares en consejos prematrimoniales?"</p>
                    <p className="mb-2"><strong>Espiritualidad:</strong> "Explica la búsqueda del amado en el capítulo 3"</p>
                    <p><strong>Simbolismo:</strong> "¿Qué representa el jardín cerrado?"</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Aplicaciones ministeriales:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Sermones sobre el matrimonio cristiano</li>
                    <li>• Enseñanza sobre la intimidad con Dios</li>
                    <li>• Cursos prematrimoniales y matrimoniales</li>
                    <li>• Estudios sobre el amor divino</li>
                    <li>• Reflexiones sobre poesía bíblica</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips and Best Practices */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Consejos y Mejores Prácticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Para obtener mejores resultados:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                    Sé específico en tus consultas - mientras más detalles proporciones, mejor será la respuesta
                  </li>
                  <li className="flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                    Indica el contexto de tu ministerio (tamaño de congregación, denominación, etc.)
                  </li>
                  <li className="flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                    Puedes hacer preguntas de seguimiento para refinar las respuestas
                  </li>
                  <li className="flex items-start">
                    <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" />
                    Experimenta con diferentes enfoques para el mismo pasaje bíblico
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Seguridad y privacidad:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 text-chart-2 flex-shrink-0" />
                    Tus conversaciones están protegidas y son privadas
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 text-chart-2 flex-shrink-0" />
                    La autenticación es segura a través de OAuth
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-4 h-4 mr-2 mt-0.5 text-chart-2 flex-shrink-0" />
                    No se comparte información personal con terceros
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">¿Necesitas Ayuda?</h3>
            <p className="text-muted-foreground mb-6">
              Nuestro equipo de soporte está aquí para ayudarte a aprovechar al máximo tus herramientas ministeriales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
                <Button size="lg" className="w-full sm:w-auto">
                  Centro de Soporte
                </Button>
              </Link>
              <a href="mailto:support@frankiefelicie.net">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Contactar Soporte
                </Button>
              </a>
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