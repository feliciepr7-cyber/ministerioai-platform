import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  // SEO Configuration for Auth Page
  useSEO({
    title: isLogin ? "Iniciar Sesión - Ministerio AI" : "Crear Cuenta - Ministerio AI",
    description: isLogin 
      ? "Accede a tu cuenta de Ministerio AI y utiliza tus herramientas de IA para el ministerio cristiano. Inicia sesión de forma segura."
      : "Únete a Ministerio AI y accede a herramientas especializadas de IA para pastores y líderes de iglesia. Crea tu cuenta gratuita.",
    keywords: isLogin 
      ? "login ministerio AI, iniciar sesión pastor, acceso herramientas AI cristiano" 
      : "registro ministerio AI, crear cuenta pastor, unirse ministerio AI",
    canonical: "/auth",
    ogTitle: isLogin ? "Iniciar Sesión en Ministerio AI" : "Crear Cuenta en Ministerio AI"
  });

  // Password reset mutations
  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      const res = await apiRequest("POST", "/api/forgot-password", data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reset Link Sent",
        description: data.message,
      });
      // In development, show the token for testing
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setShowResetPassword(true);
        setShowForgotPassword(false);
        // Pre-fill the token in the reset form
        setTimeout(() => {
          resetPasswordForm.setValue('token', data.resetToken);
        }, 100);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordForm) => {
      const res = await apiRequest("POST", "/api/reset-password", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
      setShowResetPassword(false);
      setShowForgotPassword(false);
      setIsLogin(true);
      resetPasswordForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const forgotPasswordForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Check for reset token in URL (both query params and hash)
  useEffect(() => {
    // Check URL search params first
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get('token');
    
    // If no token in search params, check hash fragment
    if (!token && window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove the #
      if (hash.startsWith('reset=')) {
        token = hash.substring(6); // Remove 'reset='
      } else if (hash.length > 20) { // Assume it's a token if it's long enough
        token = hash;
      }
    }
    
    if (token) {
      setResetToken(token);
      setShowResetPassword(true);
      setShowForgotPassword(false);
      setIsLogin(false);
      // Pre-fill the token in the form
      resetPasswordForm.setValue('token', token);
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }
  }, [resetPasswordForm]);

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

  const onForgotPassword = async (data: ForgotPasswordForm) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    try {
      await resetPasswordMutation.mutateAsync({
        ...data,
        token: resetToken || data.token,
      });
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
            {showForgotPassword ? (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Reset Password</h2>
                  <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
                </div>
                
                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4" data-testid="form-forgot-password">
                  <FloatingInput
                    label="Email Address"
                    type="email"
                    {...forgotPasswordForm.register("email")}
                    error={forgotPasswordForm.formState.errors.email?.message}
                    data-testid="input-forgot-password-email"
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={forgotPasswordMutation.isPending}
                    data-testid="button-forgot-password-submit"
                  >
                    {forgotPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
                
                <p className="text-center mt-6 text-muted-foreground">
                  Remember your password?{" "}
                  <button 
                    onClick={() => setShowForgotPassword(false)}
                    className="text-primary hover:underline font-medium"
                    data-testid="button-back-to-login"
                  >
                    Back to Sign In
                  </button>
                </p>
              </div>
            ) : showResetPassword ? (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Set New Password</h2>
                  <p className="text-muted-foreground">Enter your new password below</p>
                </div>
                
                <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4" data-testid="form-reset-password">
                  {!resetToken && (
                    <FloatingInput
                      label="Reset Token"
                      type="text"
                      {...resetPasswordForm.register("token")}
                      error={resetPasswordForm.formState.errors.token?.message}
                      data-testid="input-reset-token"
                    />
                  )}
                  
                  <FloatingInput
                    label="New Password"
                    type="password"
                    {...resetPasswordForm.register("newPassword")}
                    error={resetPasswordForm.formState.errors.newPassword?.message}
                    data-testid="input-new-password"
                  />
                  
                  <FloatingInput
                    label="Confirm New Password"
                    type="password"
                    {...resetPasswordForm.register("confirmPassword")}
                    error={resetPasswordForm.formState.errors.confirmPassword?.message}
                    data-testid="input-confirm-new-password"
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={resetPasswordMutation.isPending}
                    data-testid="button-reset-password-submit"
                  >
                    {resetPasswordMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </div>
            ) : isLogin ? (
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
                    <button 
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
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
                
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => window.location.href = '/auth/google'}
                    data-testid="button-google-signin"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
                
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
                      checked={registerForm.watch("acceptTerms")}
                      onCheckedChange={(checked) => registerForm.setValue("acceptTerms", checked === true)}
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
                
                <div className="mt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => window.location.href = '/auth/google'}
                    data-testid="button-google-signup"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
                
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
              alt="Ministerio AI Logo" 
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
