import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import images
import aiLogo from "@assets/AI_1756923008802.png";
import sermonImage from "@assets/generated_images/Sermon_generator_illustration_6bc72bc1.png";
import ceremonyImage from "@assets/generated_images/Church_ceremony_manual_3852f443.png";
import expositoryImage from "@assets/generated_images/Expository_messages_illustration_24a14fb8.png";
import securePaymentIcon from "@assets/generated_images/Secure_payment_shield_icon_ba166b10.png";
import instantAccessIcon from "@assets/generated_images/Instant_access_lightning_icon_5f7a80ea.png";
import supportIcon from "@assets/generated_images/24/7_support_headset_icon_efb44ef5.png";

const GPT_PRODUCTS = [
  {
    id: "generador-sermones",
    name: "Generador de Sermones",
    price: 20,
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
    price: 20,
    description: "Guía práctica para pastores y líderes de iglesia",
    features: [
      "Acceso de por vida al Custom GPT",
      "Guías para ceremonias",
      "Servicios especiales",
      "Excelencia ministerial"
    ],
    image: ceremonyImage,
    popular: true
  },
  {
    id: "mensajes-expositivos",
    name: "Mensajes Expositivos",
    price: 20,
    description: "Predicación bíblica clara y fiel al texto original",
    features: [
      "Acceso de por vida al Custom GPT",
      "Explicación clara de la Escritura",
      "Aplicación práctica",
      "Predicación expositiva"
    ],
    image: expositoryImage
  }
];

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={aiLogo} 
                  alt="Ministerio IA Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold text-foreground">Ministerio IA</span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={scrollToPricing} 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-pricing"
              >
                Pricing
              </button>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
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
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Herramientas Ministeriales 
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent ml-3">
                con IA
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Accede a herramientas especializadas de IA diseñadas específicamente para pastores, ministros y líderes de iglesia. 
              Potencia tu ministerio con tecnología avanzada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={scrollToPricing}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-view-pricing"
              >
                View Pricing
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                data-testid="button-try-demo"
              >
                Try Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30" id="features">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why Choose Our Platform?</h2>
            <div className="grid md:grid-cols-3 gap-8">
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
        <section className="py-20 px-4 sm:px-6 lg:px-8" id="pricing">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Herramientas Ministeriales</h2>
              <p className="text-lg text-muted-foreground">Compra una vez, úsala para siempre. Solo $20 USD cada herramienta</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {GPT_PRODUCTS.map((product) => (
                <Card 
                  key={product.id}
                  className={`relative hover:shadow-lg transition-shadow ${
                    product.popular ? 'pricing-glow border-2 border-primary transform scale-105' : ''
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
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src={aiLogo} 
                  alt="Ministerio IA Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold text-foreground">Ministerio IA</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Herramientas de IA especializadas para el ministerio cristiano con acceso seguro y permanente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">© 2024 GPT Access. All rights reserved.</p>
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
