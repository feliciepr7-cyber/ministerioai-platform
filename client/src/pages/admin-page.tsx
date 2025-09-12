import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const GPT_PRODUCTS = {
  "generador-sermones": "Generador de Sermones",
  "manual-ceremonias": "Manual de Ceremonias del Ministro", 
  "mensajes-expositivos": "Mensajes Expositivos",
  "comentario-exegetico": "Comentario Exegético",
  "epistolas-pablo": "Las Epistolas del Apostol Pablo",
  "apocalipsis": "Estudio El Libro de Apocalipsis",
  "cantar-cantares": "Estudio de Cantar de los Cantares",
};

export function AdminPage() {
  const [email, setEmail] = useState("feliciepr7@gmail.com");
  const [productId, setProductId] = useState("generador-sermones");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGrantAccess = async () => {
    if (!email || !productId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('/api/admin/grant-access', 'POST', { email, productId });

      toast({
        title: "¡Éxito!",
        description: `Acceso otorgado a ${email} para ${GPT_PRODUCTS[productId as keyof typeof GPT_PRODUCTS]}`,
      });

      // Reset form after success
      setEmail("feliciepr7@gmail.com");
      setProductId("generador-sermones");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al otorgar acceso",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🔧 Panel de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Herramienta temporal para otorgar acceso a GPTs
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Otorgar Acceso a GPT</CardTitle>
            <CardDescription>
              Crea acceso directo para un usuario específico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email del Usuario</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@email.com"
                data-testid="input-admin-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">GPT a Otorgar</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger data-testid="select-product">
                  <SelectValue placeholder="Selecciona un GPT" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GPT_PRODUCTS).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGrantAccess}
              disabled={isLoading}
              className="w-full"
              data-testid="button-grant-access"
            >
              {isLoading ? "Otorgando Acceso..." : "🚀 Otorgar Acceso"}
            </Button>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Instrucciones de Uso:
              </h3>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>1. Confirma el email del usuario</li>
                <li>2. Selecciona el GPT a otorgar</li>
                <li>3. Haz clic en "Otorgar Acceso"</li>
                <li>4. ¡El usuario tendrá acceso inmediato!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}