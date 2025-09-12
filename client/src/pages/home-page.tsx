import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";

// Import images
import aiLogo from "@assets/AI_1756923008802.png";
import sermonImage from "@assets/generated_images/Sermon_generator_illustration_6bc72bc1.png";
import ceremonyImage from "@assets/generated_images/Church_ceremony_manual_3852f443.png";
import expositoryImage from "@assets/generated_images/Expository_messages_illustration_24a14fb8.png";
import comentarioImage from "@assets/generated_images/Biblical_commentary_AI_logo_a3d6b754.png";
import epistolasImage from "@assets/generated_images/Pauline_epistles_AI_illustration_cadd8ce7.png";
import apocalipsisImage from "@assets/generated_images/Apocalypse_Bible_study_illustration_14931542.png";
import cantaresImage from "@assets/generated_images/Song_of_Solomon_study_illustration_6f23a9c5.png";
import securePaymentIcon from "@assets/generated_images/Secure_payment_shield_icon_ba166b10.png";
import instantAccessIcon from "@assets/generated_images/Instant_access_lightning_icon_5f7a80ea.png";
import supportIcon from "@assets/generated_images/24/7_support_headset_icon_efb44ef5.png";

const GPT_PRODUCTS = [
  {
    id: "generador-sermones",
    name: "Generador de Sermones",
    price: 9.99,
    description: "Prepara un bosquejo de sermón o Estudio Bíblico profundo y detallado",
    features: [
      "Acceso de por vida al Custom GPT",
      "Bosquejos de sermones detallados",
      "Estudios bíblicos profundos",
      "Basado en pasajes bíblicos"
    ],
    image: sermonImage
  },
  {
    id: "manual-ceremonias",
    name: "Manual de Ceremonias del Ministro",
    price: 9.99,
    description: "Guía práctica para pastores y líderes de iglesia",
    features: [
      "Acceso de por vida al Custom GPT",
      "Guías para ceremonias",
      "Servicios especiales",
      "Excelencia ministerial"
    ],
    image: ceremonyImage
  },
  {
    id: "mensajes-expositivos",
    name: "Mensajes Expositivos",
    price: 9.99,
    description: "Predicación bíblica clara y fiel al texto original",
    features: [
      "Acceso de por vida al Custom GPT",
      "Explicación clara de la Escritura",
      "Aplicación práctica",
      "Predicación expositiva"
    ],
    image: expositoryImage
  },
  {
    id: "comentario-exegetico",
    name: "Comentario Exegético",
    price: 9.99,
    description: "Análisis profundo y académico de textos bíblicos con rigor teológico",
    features: [
      "Acceso de por vida al Custom GPT",
      "Análisis exegético detallado",
      "Contexto histórico y cultural",
      "Interpretación teológica precisa"
    ],
    image: comentarioImage
  },
  {
    id: "epistolas-pablo",
    name: "Las Epistolas del Apostol Pablo",
    price: 9.99,
    description: "Estudio profundo de las 13 cartas paulinas con análisis teológico y aplicación práctica",
    features: [
      "Acceso de por vida al Custom GPT",
      "Análisis de las 13 epistolas paulinas",
      "Contexto histórico y teológico",
      "Aplicaciones pastorales modernas"
    ],
    image: epistolasImage,
    popular: true
  },
  {
    id: "apocalipsis",
    name: "Estudio El Libro de Apocalipsis",
    price: 9.99,
    description: "Desentraña los misterios del libro más profético y simbólico de la Biblia",
    features: [
      "Acceso de por vida al Custom GPT",
      "Análisis de las siete iglesias",
      "Simbolismo apocalíptico explicado",
      "Promesas de esperanza para la iglesia"
    ],
    image: apocalipsisImage
  },
  {
    id: "cantar-cantares",
    name: "Estudio de Cantar de los Cantares", 
    price: 9.99,
    description: "Explora la belleza del amor divino a través del libro más poético de la Biblia",
    features: [
      "Acceso de por vida al Custom GPT",
      "Múltiples interpretaciones explicadas",
      "Simbolismo y contexto cultural",
      "Aplicación para matrimonio e intimidad con Dios"
    ],
    image: cantaresImage
  }
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // SEO Configuration for Home Page
  useSEO({
    title: "Ministerio AI - Herramientas de IA para Pastores y Líderes Cristianos",
    description: "Herramientas especializadas de Inteligencia Artificial para pastores, ministros y líderes de iglesia. Generador de sermones, manual de ceremonias, mensajes expositivos y comentarios exegéticos. Compra una vez, úsalo para siempre.",
    keywords: "ministerio cristiano, herramientas pastores, AI religioso, generador sermones, comentarios biblicos, ceremonias iglesia, mensajes expositivos, comentario exegetico, pastor AI, sermones AI",
    canonical: "/",
    ogTitle: "Ministerio AI - Herramientas de IA para el Ministerio Cristiano",
    ogDescription: "Potencia tu ministerio con herramientas especializadas de IA. Generador de sermones, manual de ceremonias, mensajes expositivos y comentarios exegéticos para pastores y líderes cristianos."
  });

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      setLocation("/auth");
    }
  };

  const handleSelectProduct = (productId: string) => {
    if (user) {
      setLocation(`/checkout/${productId}`);
    } else {
      setLocation("/auth");
    }
  };

  const handleSelectMonthlyPlan = () => {
    if (user) {
      setLocation("/checkout/monthly-subscription");
    } else {
      setLocation("/auth");
    }
  };

  const handleSelectAnnualPlan = () => {
    if (user) {
      setLocation("/checkout/annual-subscription");
    } else {
      setLocation("/auth");
    }
  };

  const handleSelectFreeTrial = () => {
    if (user) {
      setLocation("/start-trial");
    } else {
      setLocation("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ministerio AI",
            "url": "https://ministerioai.com",
            "logo": "https://ministerioai.com/assets/AI_1756923008802.png",
            "description": "Herramientas especializadas de Inteligencia Artificial para pastores, ministros y líderes de iglesia",
            "offers": GPT_PRODUCTS.map(product => ({
              "@type": "Offer",
              "name": product.name,
              "description": product.description,
              "price": product.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "category": "Digital Service"
            })),
            "serviceType": "AI Tools for Christian Ministry",
            "areaServed": {
              "@type": "Place",
              "name": "Global"
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "Pastores, Ministros, Líderes de Iglesia"
            }
          })
        }}
      />
      
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={aiLogo} 
                  alt="Ministerio AI Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-lg sm:text-xl font-bold text-foreground">Ministerio AI</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={scrollToPricing} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-pricing"
              >
                Pricing
              </button>
              <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground hidden lg:block">Welcome, {user.name}</span>
                  <Link href="/dashboard">
                    <Button data-testid="button-dashboard">Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth">
                    <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-signin">
                      Sign In
                    </button>
                  </Link>
                  <Button onClick={handleGetStarted} data-testid="button-get-started">
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button 
                  onClick={() => {
                    scrollToPricing();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="mobile-nav-pricing"
                >
                  Pricing
                </button>
                <Link 
                  href="/features" 
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/support"
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <div className="border-t border-border my-2"></div>
                {user ? (
                  <>
                    <span className="block px-3 py-2 text-sm text-muted-foreground">Welcome, {user.name}</span>
                    <Link href="/dashboard">
                      <Button className="w-full mt-2" data-testid="mobile-button-dashboard">
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth">
                      <button 
                        className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground transition-colors" 
                        data-testid="mobile-button-signin"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </button>
                    </Link>
                    <Button 
                      onClick={() => {
                        handleGetStarted();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full mt-2" 
                      data-testid="mobile-button-get-started"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" role="banner">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Herramientas Ministeriales{" "}
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent block sm:inline">
                AI
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Accede a herramientas especializadas de Inteligencia Artificial diseñadas específicamente para pastores, ministros y líderes de iglesia. 
              Potencia tu ministerio con tecnología avanzada.
            </p>
            <div className="flex justify-center px-4">
              <Button 
                onClick={scrollToPricing}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                data-testid="button-view-pricing"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" id="features" role="main" aria-labelledby="features-title">
          <div className="max-w-6xl mx-auto">
            <h2 id="features-title" className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-8 sm:mb-12">¿Por Qué Elegir Nuestra Plataforma?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={securePaymentIcon} 
                      alt="Pagos Seguros" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Pagos Seguros</h3>
                  <p className="text-muted-foreground">
                    Seguridad de nivel empresarial con integración Stripe. Tus datos de pago están protegidos con encriptación líder en la industria.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={instantAccessIcon} 
                      alt="Acceso Instantáneo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Acceso Instantáneo</h3>
                  <p className="text-muted-foreground">
                    Obtén acceso inmediato a las herramientas de IA tras el pago exitoso. Sin esperas, sin demoras.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={supportIcon} 
                      alt="Soporte 24/7" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Soporte 24/7</h3>
                  <p className="text-muted-foreground">
                    Nuestro equipo de soporte dedicado está disponible las 24 horas para ayudarte con cualquier pregunta o problema.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" id="pricing" role="region" aria-labelledby="products-title">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="products-title" className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Herramientas Ministeriales AI</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2">Compra una vez, úsala para siempre. Solo $9.99 USD cada herramienta</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {GPT_PRODUCTS.map((product) => (
                <Card 
                  key={product.id}
                  className={`relative hover:shadow-lg transition-shadow ${
                    product.popular ? 'pricing-glow border-2 border-primary md:transform md:scale-105' : ''
                  }`}
                >
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>
                    </div>
                  )}
                  
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-lg mx-auto mb-4 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-foreground">${product.price}</span>
                        <span className="text-muted-foreground"> USD</span>
                      </div>
                      <p className="text-muted-foreground">{product.description}</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                          <i className="fas fa-check text-chart-2 mr-3"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => handleSelectProduct(product.id)}
                      className={`w-full ${
                        product.popular 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      data-testid={`button-select-${product.id}`}
                    >
                      Comprar Ahora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription Plans Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30" id="subscriptions" role="region" aria-labelledby="subscription-title">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 id="subscription-title" className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Planes de Suscripción</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2">Accede a todas las herramientas con un plan mensual o anual</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
              {/* Monthly Plan */}
              <Card className="relative hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Plan Mensual</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-foreground">$20</span>
                      <span className="text-muted-foreground"> USD/mes</span>
                    </div>
                    <p className="text-muted-foreground">Acceso completo a todas las herramientas</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Acceso a todos los GPTs
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Soporte prioritario
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Nuevas herramientas incluidas
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Cancela cuando quieras
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={handleSelectMonthlyPlan}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-select-monthly"
                  >
                    Comenzar Plan Mensual
                  </Button>
                </CardContent>
              </Card>

              {/* Annual Plan */}
              <Card className="relative hover:shadow-lg transition-shadow border-2 border-primary md:transform md:scale-105 pricing-glow">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Más Popular</Badge>
                </div>
                
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Plan Anual</h3>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-foreground">$65</span>
                      <span className="text-muted-foreground"> USD/año</span>
                    </div>
                    <div className="mb-4">
                      <span className="text-sm text-primary font-medium">Ahorra $175 al año</span>
                    </div>
                    <p className="text-muted-foreground">Acceso completo a todas las herramientas</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Acceso a todos los GPTs
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Soporte prioritario
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Nuevas herramientas incluidas
                    </li>
                    <li className="flex items-center text-muted-foreground">
                      <i className="fas fa-check text-chart-2 mr-3"></i>
                      Descuento del 73%
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={handleSelectAnnualPlan}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="button-select-annual"
                  >
                    Comenzar Plan Anual
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Free Trial CTA */}
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">¿No estás seguro? Prueba gratis por 3 días</p>
              <Button onClick={handleSelectFreeTrial} variant="outline" className="mx-auto" data-testid="button-free-trial">
                Comenzar Prueba Gratuita
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src={aiLogo} 
                  alt="Ministerio AI Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-lg sm:text-xl font-bold text-foreground">Ministerio AI</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Herramientas de AI especializadas para el ministerio cristiano con acceso seguro y permanente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link href="/user-guide" className="text-muted-foreground hover:text-foreground transition-colors">User Guide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support Center</Link></li>
                <li><Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="text-muted-foreground hover:text-foreground transition-colors">Status Page</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="text-muted-foreground hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2025 GPT Access. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-muted-foreground">Powered by</span>
              <div className="flex items-center space-x-2">
                <i className="fab fa-stripe text-blue-600 text-lg"></i>
                <span className="text-sm font-medium text-foreground">Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
