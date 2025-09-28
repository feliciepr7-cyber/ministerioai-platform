import { storage } from '../shared/db.js';

export default async function handler(context, req) {
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    };
    return;
  }

  try {
    const gptName = context.bindingData.gptName;
    const { userId, email } = req.body;

    if (!userId || !email) {
      context.res = {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: "Invalid request",
          message: "Usuario no válido o falta información requerida.",
          details: { userId: !!userId, email: !!email }
        })
      };
      return;
    }

    // Get user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: "User not found",
          message: "Usuario no encontrado. Por favor registrate en ministerioai.com"
        })
      };
      return;
    }

    // Get GPT models and find the requested one
    const gptModels = await storage.getGptModels();
    const gptModel = gptModels.find(model => 
      model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === gptName
    );
    
    if (!gptModel) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: "GPT not found",
          message: `GPT "${gptName}" no encontrado.`
        })
      };
      return;
    }

    // Check if user has access
    const access = await storage.getGptAccess(user.id, gptModel.id);
    if (!access) {
      context.res = {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: "Access denied",
          message: `No tienes acceso a "${gptModel.name}". Visita ministerioai.com para adquirir acceso.`,
          purchaseUrl: "https://ministerioai.com/checkout"
        })
      };
      return;
    }

    // Increment usage
    await storage.incrementGptUsage(access.id);

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: `Acceso verificado para "${gptModel.name}".`,
        gptName: gptModel.name,
        queriesUsed: access.queriesUsed + 1
      })
    };

  } catch (error) {
    console.error('GPT verification error:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: "Error interno del servidor. Por favor intenta nuevamente."
      })
    };
  }
}