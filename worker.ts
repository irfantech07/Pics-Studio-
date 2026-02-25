import { Hono } from 'hono';
import { GoogleGenAI } from "@google/genai";

type Bindings = {
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Gemini API Route
app.post('/api/process-image', async (c) => {
  try {
    const { base64Image, mimeType, style } = await c.req.json();
    const apiKey = c.env.GEMINI_API_KEY;

    if (!apiKey) {
      return c.json({ error: "GEMINI_API_KEY secret is not set in Cloudflare Worker" }, 500);
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Professional product photography, style: ${style}. Remove background and replace with ${style} studio background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: prompt }
        ],
      },
    });

    const part = response.candidates[0].content.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return c.json({ image: `data:image/png;base64,${part.inlineData.data}` });
    }
    return c.json({ error: "No image generated" }, 500);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// For Cloudflare Pages or Workers serving static assets, 
// you would usually use a different approach, but this route 
// handles the API part which is likely what's failing.

export default app;
