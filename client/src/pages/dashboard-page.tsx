import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleAccessGPT = (productId: string) => {
    accessGptMutation.mutate(productId);
  };

  const handlePurchaseGPT = (productId: string) => {
    window.location.href = `/checkout/${productId}`;
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
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-primary-foreground"></i>
              </div>
              <span className="text-xl font-bold text-foreground">GPT Access</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {dashboardData.user.name}
              </span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your GPT access and billing</p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <i className={`${product.icon} text-primary-foreground text-sm`}></i>
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
                {dashboardData.subscription ? (
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
      </div>
    </div>
  );
}
