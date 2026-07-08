import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const keyToUse = process.env.GEMINI_API_KEY;

    if (!keyToUse) {
      return NextResponse.json({ error: 'Gemini API key is required' }, { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey: keyToUse });

    const systemPrompt = `
      You are an expert AI shopping assistant. Your job is to recommend REAL-WORLD products (like actual smartphones, laptops, headphones, etc. that exist in reality) based on the user's request.
      
      RULES:
      1. Generate 3 to 6 real products that accurately match the user's criteria.
      2. If the user specifies a budget in Indian Rupees (INR, ₹, or "rupees") or any other currency, accurately estimate the conversion and ensure the products fit that budget (assume 1 USD = 83 INR).
      3. For each product, you must provide the estimated price in USD (as a plain number, no symbols).
      4. Respond ONLY with a valid JSON array of objects. Do not include markdown formatting like \`\`\`json.
      
      JSON FORMAT EXACTLY LIKE THIS:
      [
        {
          "id": "generate-a-unique-random-id-string",
          "name": "Exact Real Product Name (e.g. Samsung Galaxy S23 Ultra)",
          "category": "Broad Category (e.g. Smartphone)",
          "price": 1199,
          "description": "A compelling 2-3 sentence description of this real product and why it fits the user's request.",
          "imageSearchTerm": "A 2-word phrase to search for this product's image (e.g. galaxy s23)"
        }
      ]
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `${systemPrompt}\n\nUser request: ${query}`,
    });

    const aiContent = response.text.trim();
    let recommendedProducts = [];
    
    try {
      // Strip markdown if the AI accidentally adds it
      const cleanedContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
      recommendedProducts = JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent);
      return NextResponse.json({ error: 'The AI generated an invalid response. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ recommendations: recommendedProducts });
  } catch (error) {
    console.error("Error in recommendation API:", error);
    
    // Check if the error is a rate limit / quota error from Gemini
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted'))) {
      return NextResponse.json({ error: 'The AI is currently receiving too many requests (Rate Limit). Please wait about 45 seconds and try again!' }, { status: 429 });
    }
    
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
