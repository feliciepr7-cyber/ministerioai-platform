import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import aiLogo from "@assets/AI_1756923008802.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val, "You must accept the terms and conditions"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onLogin = async (data: LoginForm) => {
    try {
      await loginMutation.mutateAsync({
        username: data.email, // Using email as username for login
        password: data.password,
      });
      setLocation("/dashboard");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const onRegister = async (data: RegisterForm) => {
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      setLocation("/dashboard");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  if (user) return null; // Prevent flash while redirecting

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            {isLogin ? (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                  <p className="text-muted-foreground">Sign in to access your premium GPT models</p>
                </div>
                
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" data-testid="form-login">
                  <FloatingInput
                    label="Email Address"
                    type="email"
                    {...loginForm.register("email")}
                    error={loginForm.formState.errors.email?.message}
                    data-testid="input-login-email"
                  />
                  
                  <FloatingInput
                    label="Password"
                    type="password"
                    {...loginForm.register("password")}
                    error={loginForm.formState.errors.password?.message}
                    data-testid="input-login-password"
                  />
                  
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loginMutation.isPending}
                    data-testid="button-login-submit"
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
                
                <p className="text-center mt-6 text-muted-foreground">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:underline font-medium"
                    data-testid="button-switch-register"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
                  <p className="text-muted-foreground">Get started with premium GPT access</p>
                </div>
                
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4" data-testid="form-register">
                  <FloatingInput
                    label="Full Name"
                    type="text"
                    {...registerForm.register("name")}
                    error={registerForm.formState.errors.name?.message}
                    data-testid="input-register-name"
                  />
                  
                  <FloatingInput
                    label="Username"
                    type="text"
                    {...registerForm.register("username")}
                    error={registerForm.formState.errors.username?.message}
                    data-testid="input-register-username"
                  />
                  
                  <FloatingInput
                    label="Email Address"
                    type="email"
                    {...registerForm.register("email")}
                    error={registerForm.formState.errors.email?.message}
                    data-testid="input-register-email"
                  />
                  
                  <FloatingInput
                    label="Password"
                    type="password"
                    {...registerForm.register("password")}
                    error={registerForm.formState.errors.password?.message}
                    data-testid="input-register-password"
                  />
                  
                  <FloatingInput
                    label="Confirm Password"
                    type="password"
                    {...registerForm.register("confirmPassword")}
                    error={registerForm.formState.errors.confirmPassword?.message}
                    data-testid="input-register-confirm-password"
                  />
                  
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      {...registerForm.register("acceptTerms")}
                      data-testid="checkbox-accept-terms"
                    />
                    <span className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                      and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </span>
                  </div>
                  {registerForm.formState.errors.acceptTerms && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.acceptTerms.message}</p>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={registerMutation.isPending}
                    data-testid="button-register-submit"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
                
                <p className="text-center mt-6 text-muted-foreground">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:underline font-medium"
                    data-testid="button-switch-login"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Hero */}
      <div className="flex-1 bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center p-8 text-white">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <img 
              src={aiLogo} 
              alt="Ministerio IA Logo" 
              className="w-16 h-16 rounded-lg"
            />
          </div>
          <h3 className="text-3xl font-bold mb-4">Access Premium GPT Models</h3>
          <p className="text-lg opacity-90 mb-8">
            Join thousands of professionals who trust our platform for secure, reliable access to cutting-edge AI technology.
          </p>
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <i className="fas fa-shield-alt text-xl"></i>
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-bolt text-xl"></i>
              <span>Instant access after payment</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-headset text-xl"></i>
              <span>24/7 dedicated support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
