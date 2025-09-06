import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import CheckoutPage from "@/pages/checkout-page";
import VerifyPage from "@/pages/verify-page";
import FeaturesPage from "@/pages/features-page";
import UserGuidePage from "@/pages/user-guide-page";
import StatusPage from "@/pages/status-page";
import SecurityPage from "@/pages/security-page";
import PrivacyPolicyPage from "@/pages/privacy-policy-page";
import TermsOfServicePage from "@/pages/terms-of-service-page";
import SupportPage from "@/pages/support-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={AuthPage} />
      <Route path="/verify" component={VerifyPage} />
      <Route path="/checkout/:plan?" component={CheckoutPage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/user-guide" component={UserGuidePage} />
      <Route path="/status" component={StatusPage} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/support" component={SupportPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
