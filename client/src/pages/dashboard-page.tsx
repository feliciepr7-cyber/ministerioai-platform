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
    queriesUsed: number;
    queryLimit: number;
  };
  subscription: {
    id: string;
    planName: string;
    status: string;
    amount: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
  } | null;
  payments: Array<{
    id: string;
    amount: string;
    status: string;
    description: string;
    createdAt: string;
  }>;
  gptModels: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    requiredPlan: string;
  }>;
  gptAccess: Array<{
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

  const validateAccessMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const res = await apiRequest("POST", "/api/validate-access", { modelId });
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Access Granted",
        description: `You can now use ${data.model.name}. Token: ${data.accessToken.slice(0, 8)}...`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Access Denied",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleAccessGPT = (modelId: string) => {
    validateAccessMutation.mutate(modelId);
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

  const usagePercentage = dashboardData.user.queryLimit > 0 
    ? (dashboardData.user.queriesUsed / dashboardData.user.queryLimit) * 100 
    : 0;

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
                  <i className="fas fa-check text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {dashboardData.subscription ? "Active Subscription" : "No Subscription"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dashboardData.subscription?.planName || "No active plan"}
                  </p>
                </div>
              </div>
              {dashboardData.subscription && (
                <p className="text-sm text-muted-foreground">
                  Next billing: {new Date(dashboardData.subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-chart-3 rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">GPT Queries</h3>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {dashboardData.user.queriesUsed}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {dashboardData.user.queryLimit > 0 ? dashboardData.user.queryLimit : "∞"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-chart-4 rounded-lg flex items-center justify-center">
                  <i className="fas fa-credit-card text-white"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Payment Status</h3>
                  <p className="text-sm text-muted-foreground">Current month</p>
                </div>
              </div>
              <Badge 
                className={`${
                  dashboardData.subscription?.status === "active" 
                    ? "bg-chart-2 text-white" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {dashboardData.subscription?.status === "active" ? "Paid" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Available GPT Models */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-brain text-primary mr-3"></i>
                Available GPT Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.gptModels.map((model) => {
                  const modelAccess = dashboardData.gptAccess.find(access => access.modelId === model.id);
                  return (
                    <div 
                      key={model.id} 
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <i className={`${model.icon} text-primary-foreground text-sm`}></i>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{model.name}</p>
                          <p className="text-sm text-muted-foreground">{model.description}</p>
                          {modelAccess && (
                            <p className="text-xs text-chart-2">
                              Used {modelAccess.queriesUsed} times
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAccessGPT(model.id)}
                        disabled={validateAccessMutation.isPending || !dashboardData.subscription}
                        size="sm"
                        data-testid={`button-access-${model.id}`}
                      >
                        {validateAccessMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Access"
                        )}
                      </Button>
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
                Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Monthly Usage</span>
                    <span className="text-sm text-muted-foreground">{usagePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={usagePercentage} className="mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {dashboardData.user.queriesUsed} of {dashboardData.user.queryLimit > 0 ? dashboardData.user.queryLimit : "unlimited"} queries used
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
                  {dashboardData.gptAccess.length > 0 ? (
                    <div className="space-y-2">
                      {dashboardData.gptAccess.slice(0, 5).map((access, index) => {
                        const model = dashboardData.gptModels.find(m => m.id === access.modelId);
                        return (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-foreground">{model?.name || "Unknown Model"}</span>
                            <span className="text-muted-foreground">
                              {new Date(access.lastAccessed).toLocaleDateString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
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
                    <p className="text-muted-foreground mb-4">No active subscription</p>
                    <Button data-testid="button-subscribe">
                      Subscribe Now
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
