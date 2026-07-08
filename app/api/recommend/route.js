import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { products } from '@/data/products';

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
      You are an AI product recommendation assistant.
      Here is the list of available products:
      ${JSON.stringify(products, null, 2)}

      Given a user's request, find all the products that match their criteria.
      The product prices listed above are in USD. If the user specifies a budget in Indian Rupees (INR, ₹, or "rupees"), assume an exchange rate of 1 USD = 83 INR to evaluate the prices.
      Respond ONLY with a JSON array of matching product IDs. If no products match, respond with an empty JSON array [].
      Do not include markdown blocks, just the raw JSON array.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nUser request: ${query}`,
    });

    const aiContent = response.text.trim();
    let recommendedIds = [];
    
    try {
      // Sometimes the model might wrap in markdown even when told not to, so strip it just in case
      const cleanedContent = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
      recommendedIds = JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent);
      return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });
    }

    // Filter products
    const recommendedProducts = products.filter(p => recommendedIds.includes(p.id));

    return NextResponse.json({ recommendations: recommendedProducts });
  } catch (error) {
    console.error("Error in recommendation API:", error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
