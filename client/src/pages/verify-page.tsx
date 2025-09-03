import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

const GPT_PRODUCTS = {
  "generador-sermones": {
    name: "Generador de Sermones",
    description: "Prepara bosquejos de sermón y estudios bíblicos detallados",
    gptUrl: "https://chatgpt.com/g/g-68b0d8f025d081918f17cdc67fe2241b-generador-de-sermones",
  },
  "manual-ceremonias": {
    name: "Manual de Ceremonias del Ministro", 
    description: "Guía práctica para conducir ceremonias con excelencia",
    gptUrl: "https://chatgpt.com/g/g-68b46646ba548191afc0e0d7ca151cfd-manual-de-ceremonias-del-ministro",
  },
  "mensajes-expositivos": {
    name: "Mensajes Expositivos",
    description: "Predicación bíblica clara y fiel aplicada a la vida",
    gptUrl: "https://chatgpt.com/g/g-68b3bd5d57088191940ce1e37623c6d5-mensajes-expositivos",
  },
};

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    gptUrl?: string;
    productName?: string;
  } | null>(null);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !productId) {
      setVerificationResult({
        success: false,
        message: "Por favor, ingresa tu email y selecciona un producto.",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await apiRequest("POST", "/api/verify-gpt-access", {
        email,
        productId,
      });

      if (response.ok) {
        const data = await response.json();
        const product = GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS];
        
        setVerificationResult({
          success: true,
          message: "¡Acceso verificado! Puedes usar este GPT.",
          gptUrl: product.gptUrl,
          productName: product.name,
        });
      } else {
        const errorData = await response.json();
        setVerificationResult({
          success: false,
          message: "No tienes acceso a este GPT. Necesitas comprarlo primero.",
        });
      }
    } catch (error: any) {
      setVerificationResult({
        success: false,
        message: "Error al verificar acceso. Inténtalo de nuevo.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Verificación de Acceso GPT
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Verifica tu acceso a las herramientas ministeriales GPT
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800 dark:text-white">
                Verificar tu Acceso
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Ingresa tu email para verificar si tienes acceso al GPT seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleVerification} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email de Verificación
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu-email@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    data-testid="input-verification-email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selecciona el GPT
                  </label>
                  <select
                    id="product"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    data-testid="select-gpt-product"
                    required
                  >
                    <option value="">Selecciona un GPT...</option>
                    {Object.entries(GPT_PRODUCTS).map(([id, product]) => (
                      <option key={id} value={id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isVerifying}
                  data-testid="button-verify-access"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    "Verificar Acceso"
                  )}
                </Button>
              </form>

              {verificationResult && (
                <Alert className={verificationResult.success ? "border-green-200 bg-green-50 dark:bg-green-900/20" : "border-red-200 bg-red-50 dark:bg-red-900/20"}>
                  <div className="flex items-center">
                    {verificationResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <AlertDescription className={`ml-2 ${verificationResult.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                      {verificationResult.message}
                    </AlertDescription>
                  </div>
                  
                  {verificationResult.success && verificationResult.gptUrl && (
                    <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          asChild
                          className="bg-green-600 hover:bg-green-700 flex-1"
                          data-testid="button-access-gpt"
                        >
                          <a href={verificationResult.gptUrl} target="_blank" rel="noopener noreferrer">
                            Usar {verificationResult.productName}
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1"
                          data-testid="button-dashboard"
                        >
                          <Link href="/dashboard">
                            Ver Dashboard
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  {!verificationResult.success && (
                    <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-700">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          asChild
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                          data-testid="button-purchase"
                        >
                          <Link href="/dashboard">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Comprar Acceso
                          </Link>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1"
                          data-testid="button-login"
                        >
                          <Link href="/auth">
                            Iniciar Sesión
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </Alert>
              )}

              <div className="border-t pt-6">
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes una cuenta? ¿Primera vez aquí?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button asChild variant="outline" size="sm" data-testid="button-register">
                      <Link href="/auth">
                        Crear Cuenta
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" data-testid="button-home">
                      <Link href="/">
                        Página Principal
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(GPT_PRODUCTS).map(([id, product]) => (
              <Card key={id} className="text-center p-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <CardDescription className="text-sm">
                  {product.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}