import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRICING_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    description: "Perfect for individuals getting started",
    features: [
      "100 GPT queries/month",
      "3 Custom GPT models",
      "Email support"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "Ideal for professionals and small teams",
    features: [
      "1,000 GPT queries/month",
      "10 Custom GPT models",
      "Priority support",
      "API access"
    ],
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    description: "For organizations with advanced needs",
    features: [
      "Unlimited queries",
      "All GPT models",
      "24/7 phone support",
      "Custom integrations"
    ]
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

  const handleSelectPlan = (planId: string) => {
    if (user) {
      setLocation(`/checkout/${planId}`);
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
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-primary-foreground"></i>
                </div>
                <span className="text-xl font-bold text-foreground">GPT Access</span>
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
              Access Premium 
              <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent ml-3">
                Custom GPTs
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Unlock powerful AI capabilities with our curated collection of specialized GPT models. 
              Secure, professional, and ready to transform your workflow.
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
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-shield-alt text-primary-foreground text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Secure Payments</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade security with Stripe integration. Your payment data is protected with industry-leading encryption.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-chart-2 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-bolt text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Instant Access</h3>
                  <p className="text-muted-foreground">
                    Get immediate access to premium GPT models upon successful payment. No waiting, no delays.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-chart-3 rounded-lg flex items-center justify-center mb-4">
                    <i className="fas fa-users text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Our dedicated support team is available around the clock to assist with any questions or issues.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" id="pricing">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Plan</h2>
              <p className="text-lg text-muted-foreground">Select the perfect plan for your AI needs</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {PRICING_PLANS.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative hover:shadow-lg transition-shadow ${
                    plan.popular ? 'pricing-glow border-2 border-primary transform scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-muted-foreground">
                          <i className="fas fa-check text-chart-2 mr-3"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {plan.popular ? 'Start Pro Trial' : 'Get Started'}
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
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-robot text-primary-foreground"></i>
                </div>
                <span className="text-xl font-bold text-foreground">GPT Access</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Secure access to premium Custom GPT models with professional-grade payment protection.
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
