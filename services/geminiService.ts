import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SmartSearchFilters, Item } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Existing Smart Search function
export const getSmartSearchFilters = async (userQuery: string): Promise<SmartSearchFilters | null> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing. Skipping smart search.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `User search query: "${userQuery}". 
      Analyze this query and return a JSON object with search filters.
      If a specific category is mentioned or implied (e.g., "car" -> "vehicles", "phone" -> "electronics"), set 'categorySlug'.
      If a price range is mentioned (e.g. "under 5000", "cheap"), set 'minPrice' and/or 'maxPrice'.
      Extract key search terms into 'keywords'.
      Suggest a sort order if implied (e.g. "cheapest" -> "price_asc").
      
      The available category slugs are: real-estate, vehicles, electronics, home-garden, fashion, services, hobbies, pets.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categorySlug: { type: Type.STRING, nullable: true },
            minPrice: { type: Type.NUMBER, nullable: true },
            maxPrice: { type: Type.NUMBER, nullable: true },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            sortBy: { type: Type.STRING, enum: ['price_asc', 'price_desc', 'newest', 'relevance'], nullable: true }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as SmartSearchFilters;
  } catch (error) {
    console.error("Error generating smart filters:", error);
    return null;
  }
};

// --- NEW: AI Image Analysis for Item Listing ---
export const analyzeItemImage = async (base64Image: string): Promise<{
  title: string;
  description: string;
  price: number;
  condition: string;
  categoryId: number;
} | null> => {
  if (!process.env.API_KEY) return null;

  try {
    // Strip header if present to get raw base64
    const base64Data = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: `Analyze this image and provide details for a marketplace listing. 
            - Generate a catchy Title.
            - Write a compelling Description (2-3 sentences).
            - Estimate a realistic price in RUB.
            - Determine condition (new, used_good, used_fair, refurbished).
            - Select the best Category ID from: 
              1:Real Estate, 2:Vehicles, 3:Electronics, 4:Home & Garden, 
              5:Fashion, 6:Services, 7:Hobbies, 8:Pets.
            `
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            price: { type: Type.NUMBER },
            condition: { type: Type.STRING, enum: ['new', 'used_good', 'used_fair', 'refurbished'] },
            categoryId: { type: Type.INTEGER }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Error analyzing image:", error);
    return null;
  }
};

// --- NEW: AI Business Insights for Dashboard ---
export const generateBusinessInsights = async (items: Item[]): Promise<string[]> => {
  if (!process.env.API_KEY) return ["Add your API Key to enable AI insights."];

  try {
    // Summarize data to send to LLM (avoid sending too much data)
    const summary = {
      totalItems: items.length,
      totalValue: items.reduce((sum, i) => sum + (i.price || 0), 0),
      categories: items.map(i => i.category_id).reduce((acc: any, curr) => {
        acc[curr || 0] = (acc[curr || 0] || 0) + 1;
        return acc;
      }, {}),
      topViews: items.sort((a, b) => b.views_count - a.views_count).slice(0, 3).map(i => ({ title: i.title, views: i.views_count }))
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a business consultant for a marketplace seller. 
      Analyze this inventory summary: ${JSON.stringify(summary)}.
      Provide 3 specific, actionable, and short tips (max 15 words each) to increase sales or optimize inventory.
      Focus on pricing strategy, listing quality, or stock mix.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return ["Optimize your titles for better search visibility.", "Consider promoting your high-value items.", "Review pricing on older stock."];
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating insights:", error);
    return ["Optimize your titles for better search visibility.", "Consider promoting your high-value items.", "Review pricing on older stock."];
  }
};

// --- NEW: AI Inventory Report Generation ---
export const generateInventoryReport = async (items: Item[]): Promise<string> => {
  if (!process.env.API_KEY) return "## Error\nAPI Key is missing. Please check your configuration.";

  try {
    // optimize payload for context window
    const inventoryData = items.map(i => ({
      name: i.title,
      qty: i.quantity,
      price: i.price,
      status: i.status,
      views: i.views_count,
      cat: i.category_id
    })).slice(0, 50); // Limit items for demo

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Analyze this inventory data and generate a strategic performance report in Markdown format.
        Data: ${JSON.stringify(inventoryData)}

        Structure the report as follows:
        # Inventory Performance Report 📊
        
        ## 1. Executive Summary
        (Brief overview of total valuation, item count, and health)

        ## 2. 🚨 Critical Attention Needed
        (Identify low stock items (qty < 2), stagnant items with low views, or status issues)

        ## 3. 📈 Top Performers
        (Highlight high view/high value items)

        ## 4. 💡 AI Recommendations
        (3-4 specific, actionable bullet points for the seller to optimize stock)
      `,
    });

    return response.text || "No report generated.";
  } catch (error) {
    console.error("Report generation failed", error);
    return "Failed to generate report due to an API error. Please try again later.";
  }
};