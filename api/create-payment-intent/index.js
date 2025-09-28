import Stripe from 'stripe';
import { storage } from '../shared/db.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const GPT_PRODUCTS = {
  "generador-sermones": { name: "Generador de Sermones", price: 9.99 },
  "manual-ceremonias": { name: "Manual de Ceremonias del Ministro", price: 9.99 },
  "mensajes-expositivos": { name: "Mensajes Expositivos", price: 9.99 },
  "comentario-exegetico": { name: "Comentario Exegético", price: 9.99 },
  "epistolas-pablo": { name: "Las Epistolas del Apostol Pablo", price: 9.99 },
  "apocalipsis": { name: "Estudio El Libro de Apocalipsis", price: 9.99 },
  "cantar-cantares": { name: "Estudio de Cantar de los Cantares", price: 9.99 },
  "capacitacion-biblica": { name: "Capacitacion Bíblica para Servidores de Ministerio", price: 9.99 },
  "diccionario-biblico": { name: "Diccionario Bíblico", price: 9.99 }
};

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
    const { productId, userEmail } = req.body;

    if (!productId || !userEmail) {
      context.res = {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Product ID and user email are required" })
      };
      return;
    }

    const product = GPT_PRODUCTS[productId];
    if (!product) {
      context.res = {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Invalid product" })
      };
      return;
    }

    // Get user
    const user = await storage.getUserByEmail(userEmail);
    if (!user) {
      context.res = {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "User not found" })
      };
      return;
    }

    // Create or get Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });

      await storage.updateUser(user.id, {
        stripeCustomerId: customer.id,
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100),
      currency: 'usd',
      customer: customer.id,
      metadata: {
        userId: user.id,
        productId,
        productName: product.name,
      },
    });

    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };

  } catch (error) {
    console.error('Payment intent creation error:', error);
    context.res = {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: "Error creating payment intent: " + error.message })
    };
  }
}