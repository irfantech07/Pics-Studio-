import { GoogleGenAI } from "@google/genai";
import { ImageStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processProductImage(
  base64Image: string,
  mimeType: string,
  style: ImageStyle,
  category?: string
): Promise<string | null> {
  try {
    const prompt = `
      You are a professional e-commerce product photographer and editor.
      Task: Remove the background of the main product in this image and replace it with a new background.
      
      Requirements:
      1. Detect the main product accurately.
      2. Remove the existing background completely.
      3. Generate a new background in "${style}" style.
      4. The new background should complement the product's colors and theme.
      5. Ensure professional studio-quality lighting and shadows that make the product pop.
      6. Keep the product at its original scale but centered.
      7. Output ONLY the edited image.
      
      Style Guide:
      - minimal: Clean, solid or very subtle gradient background, often white or light gray.
      - luxury: Premium textures like marble, silk, or dark elegant wood with dramatic lighting.
      - tech: Modern, sleek, maybe some subtle glow or geometric patterns, cool tones.
      - soft: Pastel colors, soft shadows, warm inviting atmosphere.
      - premium: High-end studio look with professional depth of field and clean surfaces.
      - outdoor: Natural lighting, blurred nature or urban background that fits the product.
      - studio: Classic professional product photography setup with softbox lighting.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove data:image/png;base64,
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
    console.error("Error processing image with Gemini:", error);
    throw error;
  }
}
