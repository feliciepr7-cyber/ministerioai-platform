import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSEO } from "@/hooks/useSEO";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";
import aiLogo from "@assets/AI_1756923008802.png";
import sermonGeneratorImage from "@assets/generated_images/Sermon_generator_illustration_6bc72bc1.png";
import ceremoniasManualImage from "@assets/generated_images/Church_ceremony_manual_3852f443.png";
import mensajesExpositivosImage from "@assets/generated_images/Expository_messages_illustration_24a14fb8.png";
import comentarioExegeticoImage from "@assets/generated_images/Biblical_commentary_AI_logo_a3d6b754.png";

interface DashboardData {
  user: {
    name: string;
    email: string;
  };
  payments: Array<{
    id: string;
    amount: string;
    status: string;
    description: string;
    createdAt: string;
  }>;
  availableProducts: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    icon: string;
    purchased: boolean;
  }>;
  purchasedGpts: Array<{
    modelId: string;
    queriesUsed: number;
    lastAccessed: string;
  }>;
}

export default function DashboardPage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminProductId, setAdminProductId] = useState("");
  
  // SEO Configuration for Dashboard Page
  useSEO({
    title: "Dashboard - Ministerio AI",
    description: "Accede a tus herramientas de IA ministerial, gestiona tus compras y utiliza los Custom GPTs para potenciar tu ministerio cristiano.",
    keywords: "dashboard ministerio AI, panel pastor, herramientas AI cristiano, gestión ministerio, acceso GPT",
    canonical: "/dashboard",
    noIndex: true // Dashboard should not be indexed by search engines
  });
  
  // Check if current user is admin
  const isAdmin = user?.email === "feliciepr7@gmail.com";
  

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    enabled: !!user,
  });

  const accessGptMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await apiRequest("POST", "/api/access-gpt", { productId });
      return await res.json();
    },
    onSuccess: (data) => {
      // Open Custom GPT in new tab
      window.open(data.gptUrl, '_blank');
      toast({
        title: "Acceso Concedido",
        description: `Abriendo ${data.productName}. Uso total: ${data.totalUsage}`,
      });
      // Refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Acceso Denegado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const grantAccessMutation = useMutation({
    mutationFn: async ({ email, productId }: { email: string; productId: string }) => {
      const res = await apiRequest("POST", "/api/admin/grant-access", { email, productId });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Acceso Concedido",
        description: data.message,
      });
      setAdminEmail("");
      setAdminProductId("");
      // Refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al conceder acceso",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleAccessGPT = (productId: string) => {
    accessGptMutation.mutate(productId);
  };

  const handlePurchaseGPT = (productId: string) => {
    setLocation(`/checkout/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Unable to load dashboard data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPurchased = dashboardData.availableProducts.filter(p => p.purchased).length;
  const totalSpent = dashboardData.payments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

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
              <span className="text-lg sm:text-xl font-bold text-foreground">Ministerio AI</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, {dashboardData.user.name}
              </span>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/support")}
                size="sm"
                data-testid="button-support"
              >
                Support
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
                size="sm"
              >
                {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your GPT access and billing</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-chart-2 rounded-lg flex items-center justify-center">
                  <i className="fas fa-shopping-cart text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Herramientas Compradas</h3>
                  <p className="text-sm text-muted-foreground">Total de GPTs</p>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {totalPurchased}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {dashboardData.availableProducts.length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-chart-3 rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Usos Totales</h3>
                  <p className="text-sm text-muted-foreground">Todas las herramientas</p>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {dashboardData.purchasedGpts.reduce((sum, gpt) => sum + (gpt.queriesUsed || 0), 0)}
                </span>
                <span className="text-sm text-muted-foreground">
                  consultas
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-chart-4 rounded-lg flex items-center justify-center">
                  <i className="fas fa-dollar-sign text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Total Invertido</h3>
                  <p className="text-sm text-muted-foreground">En herramientas</p>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  ${totalSpent.toFixed(0)}
                </span>
                <span className="text-sm text-muted-foreground">
                  USD
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Available GPT Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-brain text-primary mr-3"></i>
                Herramientas Ministeriales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.availableProducts.map((product) => {
                  const productAccess = dashboardData.purchasedGpts.find(access => access.modelId === product.id);
                  return (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          {product.id === 'generador-sermones' && (
                            <img src={sermonGeneratorImage} alt="Generador de Sermones" className="w-full h-full object-cover" />
                          )}
                          {product.id === 'manual-ceremonias' && (
                            <img src={ceremoniasManualImage} alt="Manual de Ceremonias del Ministro" className="w-full h-full object-cover" />
                          )}
                          {product.id === 'mensajes-expositivos' && (
                            <img src={mensajesExpositivosImage} alt="Mensajes Expositivos" className="w-full h-full object-cover" />
                          )}
                          {product.id === 'comentario-exegetico' && (
                            <img src={comentarioExegeticoImage} alt="Comentario Exegético" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          {productAccess && (
                            <p className="text-xs text-chart-2">
                              Usado {productAccess.queriesUsed || 0} veces
                            </p>
                          )}
                          {!product.purchased && (
                            <p className="text-xs text-chart-4 font-medium">
                              ${product.price} USD - Pago único
                            </p>
                          )}
                        </div>
                      </div>
                      {product.purchased ? (
                        <Button
                          onClick={() => handleAccessGPT(product.id)}
                          disabled={accessGptMutation.isPending}
                          size="sm"
                          data-testid={`button-access-${product.id}`}
                        >
                          {accessGptMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Usar"
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handlePurchaseGPT(product.id)}
                          variant="outline"
                          size="sm"
                          data-testid={`button-purchase-${product.id}`}
                        >
                          Comprar
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Usage Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-chart-bar text-primary mr-3"></i>
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Herramientas Activas</span>
                    <span className="text-sm text-muted-foreground">{totalPurchased}/{dashboardData.availableProducts.length}</span>
                  </div>
                  <Progress value={(totalPurchased / dashboardData.availableProducts.length) * 100} className="mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {totalPurchased} de {dashboardData.availableProducts.length} herramientas adquiridas
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-3">Actividad Reciente</h4>
                  {dashboardData.purchasedGpts.length > 0 ? (
                    <div className="space-y-2">
                      {dashboardData.purchasedGpts.slice(0, 5).map((access, index) => {
                        const product = dashboardData.availableProducts.find(p => p.id === access.modelId);
                        return (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-foreground">{product?.name || "Herramienta Desconocida"}</span>
                            <span className="text-muted-foreground">
                              {new Date(access.lastAccessed).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-receipt text-primary mr-3"></i>
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-border/50">
                        <td className="py-3 text-sm text-foreground">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-sm text-foreground">{payment.description}</td>
                        <td className="py-3 text-sm text-foreground">${payment.amount}</td>
                        <td className="py-3 text-sm">
                          <Badge 
                            className={
                              payment.status === "succeeded" 
                                ? "bg-chart-2 text-white" 
                                : "bg-destructive text-destructive-foreground"
                            }
                          >
                            {payment.status === "succeeded" ? "Paid" : "Failed"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No payment history available</p>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-user text-primary mr-3"></i>
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Email Notifications</span>
                  <Switch defaultChecked data-testid="switch-email-notifications" />
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Usage Alerts</span>
                  <Switch data-testid="switch-usage-alerts" />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  data-testid="button-change-password"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-credit-card text-primary mr-3"></i>
                Billing Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {totalPurchased > 0 ? (
                  <>
                    <div className="bg-muted/30 border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <i className="fab fa-cc-visa text-blue-600 text-xl"></i>
                          <div>
                            <p className="font-medium text-foreground">•••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/28</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          data-testid="button-update-payment"
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        data-testid="button-change-plan"
                      >
                        Change Plan
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        data-testid="button-cancel-subscription"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No hay herramientas compradas aún</p>
                    <Button onClick={() => window.location.href = '/'} data-testid="button-browse-products">
                      Ver Herramientas
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Section - Only visible to admin */}
        {isAdmin && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
                <Shield className="mr-3" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    Email del Usuario
                  </label>
                  <Input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="bg-white dark:bg-gray-800"
                    data-testid="input-admin-email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                    Producto a Conceder
                  </label>
                  <select
                    value={adminProductId}
                    onChange={(e) => setAdminProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800"
                    data-testid="select-admin-product"
                  >
                    <option value="">Selecciona un GPT...</option>
                    <option value="generador-sermones">Generador de Sermones</option>
                    <option value="manual-ceremonias">Manual de Ceremonias del Ministro</option>
                    <option value="mensajes-expositivos">Mensajes Expositivos</option>
                  </select>
                </div>

                <Button
                  onClick={() => {
                    if (adminEmail && adminProductId) {
                      grantAccessMutation.mutate({ email: adminEmail, productId: adminProductId });
                    }
                  }}
                  disabled={!adminEmail || !adminProductId || grantAccessMutation.isPending}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  data-testid="button-grant-access"
                >
                  {grantAccessMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Concediendo Acceso...
                    </>
                  ) : (
                    "Conceder Acceso Gratuito"
                  )}
                </Button>

                <div className="bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    <strong>Instrucciones:</strong> Ingresa el email del usuario y selecciona el GPT al que quieres conceder acceso gratuito. 
                    El usuario podrá usar el GPT inmediatamente sin necesidad de pago.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
