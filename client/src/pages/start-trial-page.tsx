import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

export default function StartTrialPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    const startTrial = async () => {
      try {
        const response = await apiRequest("/api/trial/start", "POST", {});
        const data = await response.json();
        
        toast({
          title: "¡Prueba gratuita activada!",
          description: `Tienes acceso a todos los GPTs hasta ${new Date(data.trialEndsAt).toLocaleDateString()}`,
        });

        // Redirect to dashboard after short delay
        setTimeout(() => {
          setLocation("/dashboard");
        }, 2000);

      } catch (error: any) {
        toast({
          title: "Error al iniciar prueba",
          description: error.message,
          variant: "destructive",
        });
        setLocation("/");
      }
    };

    startTrial();
  }, [user, setLocation, toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <CheckCircle className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Iniciando tu prueba gratuita
              </h2>
              <p className="text-muted-foreground text-sm">
                Configurando tu acceso a todos los GPTs por 3 días...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}