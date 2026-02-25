import { GoogleGenAI } from "@google/genai";
import { ImageStyle } from "../types";

export async function processProductImage(
  base64Image: string,
  mimeType: string,
  style: ImageStyle,
  category?: string
): Promise<string | null> {
  // Try calling the server-side API first
  try {
    const response = await fetch("/api/process-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base64Image: base64Image.split(',')[1],
        mimeType,
        style,
        category
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.image;
    }
    
    // If it's not a 404, throw the error
    if (response.status !== 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
  } catch (error) {
    console.warn("Server-side processing failed, falling back to client-side:", error);
    // If it's a real error (not just a 404), we might want to show it, 
    // but for now let's try falling back.
  }

  // Fallback to client-side processing
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Professional product photography, style: ${style}. Remove background and replace with ${style} studio background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error("Client-side processing failed:", error);
    throw error;
  }
}
