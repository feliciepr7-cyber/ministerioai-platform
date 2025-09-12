import OpenAI from "openai";

// Using GPT-4o for stable AI support responses with reliable JSON formatting
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SupportResponse {
  response: string;
  nextSteps?: string[];
  severity: "low" | "medium" | "high" | "critical";
  category: "access" | "payment" | "technical" | "account" | "general";
}

const PLATFORM_KNOWLEDGE = `
# Ministerio AI - Plataforma de GPTs Especializados

## Qué es Ministerio AI
Es una plataforma de suscripción que ofrece 7 GPTs especializados para ministerios cristianos con códigos de acceso únicos MIA.

## GPTs Disponibles:
1. **Generador de Sermones** - Prepara bosquejos de sermones y estudios bíblicos detallados
2. **Manual de Ceremonias del Ministro** - Guía para ceremonias y servicios especiales
3. **Mensajes Expositivos** - Estilo de predicación y enseñanza bíblica clara
4. **Comentario Exegético** - Análisis profundo y académico de textos bíblicos
5. **Las Epístolas del Apóstol Pablo** - Estudio exhaustivo de las 13 cartas paulinas
6. **Estudio El Libro de Apocalipsis** - Desentraña los misterios del libro más profético
7. **Estudio de Cantar de los Cantares** - Explora la belleza del amor divino

## Precios:
- La mayoría: $20 USD cada uno
- Apocalipsis: $25 USD
- Cantar de los Cantares: $22 USD

## Cómo Funciona:
1. Usuario se registra con email/contraseña
2. Compra acceso individual a GPTs via Stripe
3. Recibe códigos MIA únicos para cada GPT
4. Usa códigos en ChatGPT para acceder

## Problemas Comunes y Soluciones:

### Acceso a GPTs
- **Problema**: "No veo el botón 'Usar GPT'"
  **Solución**: Verificar que el pago se procesó correctamente. Revisar en Dashboard si aparece como "Comprado".

- **Problema**: "Código MIA no funciona en ChatGPT"
  **Solución**: Asegurar que el código se escriba exactamente: MIA-XXXX-XXXX. Verificar que el GPT esté activo.

### Pagos
- **Problema**: "Mi pago no se refleja"
  **Solución**: Los pagos pueden tardar hasta 24 horas. Verificar email de confirmación de Stripe.

- **Problema**: "Error al procesar pago"
  **Solución**: Verificar datos de tarjeta, fondos suficientes. Probar con otra tarjeta si persiste.

### Cuenta
- **Problema**: "No puedo iniciar sesión"
  **Solución**: Verificar email y contraseña. Usar opción "Olvidé mi contraseña" si es necesario.

- **Problema**: "No recibí email de confirmación"
  **Solución**: Revisar carpeta de spam. Reenviar desde la plataforma si es necesario.

### Técnicos
- **Problema**: "La página no carga"
  **Solución**: Limpiar caché del navegador, probar en modo incógnito, verificar conexión a internet.

- **Problema**: "Error en ChatGPT al usar código"
  **Solución**: Asegurar que está logueado en ChatGPT, que tiene suscripción ChatGPT Plus/Pro, y que el código está bien escrito.

## Contacto
- Email de soporte: Disponible en la plataforma
- Los usuarios pueden crear tickets de soporte para problemas específicos
`;

export async function generateSupportResponse(userQuery: string, userContext?: {
  email?: string;
  hasPurchases?: boolean;
  recentActivity?: string;
}): Promise<SupportResponse> {
  try {
    const systemPrompt = `Eres un asistente de soporte técnico especializado en Ministerio AI. 

CONOCIMIENTO DE LA PLATAFORMA:
${PLATFORM_KNOWLEDGE}

INSTRUCCIONES:
1. Responde SOLO sobre Ministerio AI y sus GPTs
2. Sé empático y profesional
3. Ofrece soluciones claras paso a paso
4. Si no sabes algo específico, admítelo y sugiere contactar al equipo técnico
5. Clasifica la severidad: low (consulta general), medium (problema funcional), high (pago/acceso), critical (cuenta bloqueada)
6. Clasifica la categoría: access, payment, technical, account, general
7. Responde en español siempre
8. Máximo 300 palabras por respuesta

CONTEXTO DEL USUARIO: ${userContext ? JSON.stringify(userContext) : 'No disponible'}

Responde en formato JSON con esta estructura:
{
  "response": "tu respuesta detallada aquí",
  "nextSteps": ["paso 1", "paso 2", "paso 3"],
  "severity": "low|medium|high|critical",
  "category": "access|payment|technical|account|general"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for stable compatibility
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuery }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      response: result.response || "Lo siento, no pude procesar tu consulta. Por favor contacta al equipo de soporte.",
      nextSteps: result.nextSteps || [],
      severity: result.severity || "medium",
      category: result.category || "general"
    };

  } catch (error: any) {
    console.error("AI Support error:", error);
    return {
      response: "Disculpa, estoy experimentando problemas técnicos temporales. Por favor intenta nuevamente en unos minutos o contacta directamente al equipo de soporte.",
      nextSteps: [
        "Intenta nuevamente en 2-3 minutos",
        "Si persiste, usa el formulario de contacto tradicional",
        "Incluye detalles específicos de tu problema"
      ],
      severity: "medium",
      category: "technical"
    };
  }
}

export async function analyzeUserSentiment(message: string): Promise<{
  sentiment: "positive" | "neutral" | "negative";
  urgency: "low" | "medium" | "high";
  keywords: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for stable compatibility
      messages: [
        {
          role: "system",
          content: `Analiza el sentimiento y urgencia del siguiente mensaje de soporte. 
          
          Responde en JSON:
          {
            "sentiment": "positive|neutral|negative",
            "urgency": "low|medium|high", 
            "keywords": ["palabra1", "palabra2"]
          }
          
          Urgencia alta: palabras como "urgente", "no funciona", "error", "problema crítico"
          Urgencia media: "no puedo acceder", "ayuda", "problema"
          Urgencia baja: "pregunta", "consulta", "información"`
        },
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    return {
      sentiment: "neutral",
      urgency: "medium", 
      keywords: []
    };
  }
}