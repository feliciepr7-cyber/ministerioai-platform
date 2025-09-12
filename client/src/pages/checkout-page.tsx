import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import aiLogo from "@assets/AI_1756923008802.png";
import { Loader2 } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error("Missing required environment variable: VITE_STRIPE_PUBLIC_KEY");
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const GPT_PRODUCTS = {
  "generador-sermones": {
    name: "Generador de Sermones",
    price: 9.99,
    features: ["Acceso de por vida al Custom GPT", "Bosquejos de sermones detallados", "Estudios bíblicos profundos", "Basado en pasajes bíblicos"]
  },
  "manual-ceremonias": {
    name: "Manual de Ceremonias del Ministro",
    price: 9.99,
    features: ["Acceso de por vida al Custom GPT", "Guías para ceremonias", "Servicios especiales", "Excelencia ministerial"]
  },
  "mensajes-expositivos": {
    name: "Mensajes Expositivos",
    price: 9.99,
    features: ["Acceso de por vida al Custom GPT", "Explicación clara de la Escritura", "Aplicación práctica", "Predicación expositiva"]
  },
  "comentario-exegetico": {
    name: "Comentario Exegético",
    price: 9.99,
    features: ["Acceso de por vida al Custom GPT", "Análisis exegético detallado", "Contexto histórico y cultural", "Interpretación teológica precisa"]
  },
  "epistolas-pablo": {
    name: "Las Epistolas del Apostol Pablo",
    price: 9.99,
    features: ["Acceso de por vida al Custom GPT", "Análisis de las 13 epistolas paulinas", "Contexto histórico y teológico", "Aplicaciones pastorales modernas"]
  },
  "apocalipsis": {
    name: "Estudio El Libro de Apocalipsis",
    price: 9.99,
    features: ["Acceso de por vida al Custom GPT", "Análisis de las siete iglesias", "Simbolismo apocalíptico explicado", "Promesas de esperanza para la iglesia"]
  },
  "cantar-cantares": {
    name: "Estudio de Cantar de los Cantares", 
    price: 9.99,
    features: ["Acceso de por vida al Custom GPT", "Múltiples interpretaciones explicadas", "Simbolismo y contexto cultural", "Aplicación para matrimonio e intimidad con Dios"]
  },
  "monthly-subscription": {
    name: "Plan Mensual",
    price: 20,
    features: ["Acceso a todos los GPTs", "Soporte prioritario", "Nuevas herramientas incluidas", "Cancela cuando quieras"]
  },
  "annual-subscription": {
    name: "Plan Anual", 
    price: 65,
    features: ["Acceso a todos los GPTs", "Soporte prioritario", "Nuevas herramientas incluidas", "Descuento del 73%"]
  },
};

interface CheckoutFormProps {
  planId: string;
}

function CheckoutForm({ planId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const product = GPT_PRODUCTS[planId as keyof typeof GPT_PRODUCTS];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on the server side
        try {
          console.log("Confirming payment with server...");
          await apiRequest("/api/confirm-payment", "POST", { 
            paymentIntentId: paymentIntent.id 
          });
          console.log("Payment confirmed successfully");
          
          toast({
            title: "Payment Successful",
            description: "Thank you for your purchase! Access granted.",
          });
          
          toast({
            title: "Redirecting...",
            description: "Taking you to dashboard with updated access.",
          });
          
          // Simple approach: redirect and force a complete page refresh
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } catch (error: any) {
          toast({
            title: "Payment Processing Error",
            description: "Payment succeeded but there was an issue granting access. Please contact support.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Purchase</h2>
            <div className="bg-muted rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">{product.name}</span>
                <span className="text-2xl font-bold text-foreground">${product.price} USD</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <FloatingInput
                label="Email Address"
                type="email"
                required
                defaultValue=""
                data-testid="input-billing-email"
              />

              <div className="border border-border rounded-lg p-4 bg-background">
                <label className="text-sm font-medium text-foreground block mb-3">
                  Card Information
                </label>
                <PaymentElement />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="First Name"
                  type="text"
                  required
                  data-testid="input-billing-first-name"
                />
                
                <FloatingInput
                  label="Last Name"
                  type="text"
                  required
                  data-testid="input-billing-last-name"
                />
              </div>
              
              <FloatingInput
                label="Address"
                type="text"
                required
                data-testid="input-billing-address"
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingInput
                  label="City"
                  type="text"
                  required
                  data-testid="input-billing-city"
                />
                
                <FloatingInput
                  label="ZIP Code"
                  type="text"
                  required
                  data-testid="input-billing-zip"
                />
              </div>

              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-lock text-chart-2"></i>
                  <div>
                    <p className="text-sm font-medium text-foreground">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setLocation("/")}
                data-testid="button-cancel-payment"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!stripe || !elements || isProcessing}
                data-testid="button-complete-payment"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pagar $${product.price} USD`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

interface CheckoutPageProps {
  params: { plan?: string };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const productId = params.plan || "manual-ceremonias";
  const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    if (!product) {
      toast({
        title: "Producto Inválido",
        description: "El producto seleccionado no está disponible.",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    // Create payment intent or subscription based on product type
    const createPaymentIntent = async () => {
      try {
        const isSubscription = productId === 'monthly-subscription' || productId === 'annual-subscription';
        
        if (isSubscription) {
          // Use subscription endpoint for monthly/annual plans
          const planType = productId === 'monthly-subscription' ? 'monthly' : 'annual';
          // Use test Stripe price IDs - these should be replaced with real ones in production
          const priceId = planType === 'monthly' ? 'price_1234567890_monthly' : 'price_1234567890_annual';
          
          const res = await apiRequest("/api/subscriptions", "POST", {
            priceId: priceId,
            planType: planType
          });
          const data = await res.json();
          setClientSecret(data.clientSecret);
        } else {
          // Use payment intent for individual GPT purchases
          const res = await apiRequest("/api/create-payment-intent", "POST", {
            productId: productId,
          });
          const data = await res.json();
          setClientSecret(data.clientSecret);
        }
      } catch (error: any) {
        toast({
          title: "Error de Configuración",
          description: error.message,
          variant: "destructive",
        });
        setLocation("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [user, productId, product, setLocation, toast]);

  if (!user) {
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Producto inválido seleccionado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Setting up your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img 
                src={aiLogo} 
                alt="Ministerio AI Logo" 
                className="w-8 h-8 rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">Ministerio AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Comprar {product.name}</h1>
          <p className="text-muted-foreground">Completa tu compra para acceder de por vida a esta herramienta</p>
        </div>

        {/* Plan Details */}
        <div className="max-w-md mx-auto mb-8">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                <Badge variant="secondary">Seleccionado</Badge>
              </div>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-foreground">${product.price}</span>
                <span className="text-muted-foreground"> USD - Pago único</span>
              </div>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-muted-foreground">
                    <i className="fas fa-check text-chart-2 mr-3"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm planId={productId} />
        </Elements>
      </div>
    </div>
  );
}
