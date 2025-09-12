import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Bot, User, Send, ArrowLeft, MessageSquare, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  severity?: "low" | "medium" | "high" | "critical";
  category?: "access" | "payment" | "technical" | "account" | "general";
  nextSteps?: string[];
}

interface SupportResponse {
  response: string;
  nextSteps?: string[];
  severity: "low" | "medium" | "high" | "critical";
  category: "access" | "payment" | "technical" | "account" | "general";
  sentiment: "positive" | "neutral" | "negative";
  urgency: "low" | "medium" | "high";
}

const SEVERITY_COLORS = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const CATEGORY_LABELS = {
  access: "Acceso",
  payment: "Pagos",
  technical: "Técnico",
  account: "Cuenta",
  general: "General",
};

export default function AISupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "¡Hola! Soy tu asistente de soporte de Ministerio AI. Estoy aquí para ayudarte con cualquier problema o pregunta sobre nuestros GPTs especializados. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: "Asistente AI de Soporte - Ministerio AI",
    description: "Obtén ayuda instantánea con nuestro asistente de IA especializado en Ministerio AI. Resuelve problemas de acceso, pagos y soporte técnico las 24 horas.",
    keywords: "asistente AI soporte, chatbot ministerio AI, ayuda automática pastor, soporte inteligente",
    canonical: "/ai-support",
    noIndex: true
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Support Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<SupportResponse> => {
      const response = await apiRequest('/api/support/chat', 'POST', { message });
      return response as unknown as SupportResponse;
    },
    onSuccess: (response, userMessage) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + "-assistant",
        type: "assistant",
        content: response.response,
        timestamp: new Date(),
        severity: response.severity,
        category: response.category,
        nextSteps: response.nextSteps
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCurrentMessage("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Error al procesar tu mensaje. Intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + "-user",
      type: "user",
      content: currentMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(currentMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/dashboard")}
              className="flex items-center gap-2"
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-500 text-white rounded-full">
                <Bot className="w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Asistente AI de Soporte
              </h1>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Obtén ayuda instantánea y especializada sobre Ministerio AI. Nuestro asistente inteligente 
              puede resolver problemas de acceso, pagos, configuración y más.
            </p>
          </div>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Chat de Soporte AI
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                  data-testid={`message-${message.type}-${message.id}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" 
                      ? "bg-blue-500 text-white" 
                      : "bg-green-500 text-white"
                  }`}>
                    {message.type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`max-w-[80%] ${
                    message.type === "user" ? "text-right" : "text-left"
                  }`}>
                    <div className={`inline-block p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {/* Assistant message metadata */}
                    {message.type === "assistant" && (message.severity || message.category) && (
                      <div className="flex gap-2 mt-2 justify-start">
                        {message.severity && (
                          <Badge className={SEVERITY_COLORS[message.severity]}>
                            {message.severity}
                          </Badge>
                        )}
                        {message.category && (
                          <Badge variant="outline">
                            {CATEGORY_LABELS[message.category]}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Next steps */}
                    {message.nextSteps && message.nextSteps.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Próximos pasos:
                        </h4>
                        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          {message.nextSteps.map((step, index) => (
                            <li key={index}>
                              {index + 1}. {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      <span className="text-sm text-gray-500 ml-2">Analizando tu consulta...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu pregunta o describe tu problema..."
                  className="flex-1 min-h-[60px] max-h-[120px] resize-none"
                  disabled={chatMutation.isPending}
                  data-testid="textarea-chat-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || chatMutation.isPending}
                  className="self-end px-4 py-2 h-[60px]"
                  data-testid="button-send-message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                Presiona Enter para enviar, Shift+Enter para nueva línea
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Help Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">💬 Preguntas Comunes</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• ¿Cómo uso mi código MIA?</li>
              <li>• No veo el botón "Usar GPT"</li>
              <li>• Problemas con pagos</li>
            </ul>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">⚡ Respuestas Instantáneas</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Análisis automático del problema</li>
              <li>• Soluciones paso a paso</li>
              <li>• Disponible 24/7</li>
            </ul>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">🎯 Soporte Especializado</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Conocimiento específico de la plataforma</li>
              <li>• Contexto de tu cuenta</li>
              <li>• Priorización inteligente</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}