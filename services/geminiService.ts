
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

let aiInstance: GoogleGenAI | null = null;

const getAi = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiInstance;
};

export const getAIRecommendations = async (query: string, products: Product[]) => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User is searching for: "${query}". 
      Here are the available products in our database: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, desc: p.description })))}.
      Based on the user's query, recommend the top 3 product IDs that are most relevant. 
      Also provide a short explanation why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["productId", "reason"]
              }
            }
          },
          required: ["recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { recommendations: [] };
  }
};

export const chatWithGemini = async (message: string, context: string) => {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful e-commerce shopping assistant for ONOS. 
      Context: ${context}.
      User Message: ${message}.
      Provide a helpful, concise response.`,
    });
    return response.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm sorry, I'm having trouble connecting right now.";
  }
};
