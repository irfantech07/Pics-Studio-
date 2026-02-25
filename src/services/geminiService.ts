import { ImageStyle } from "../types";

export async function processProductImage(
  base64Image: string,
  mimeType: string,
  style: ImageStyle,
  category?: string
): Promise<string | null> {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process image");
    }

    const data = await response.json();
    return data.image;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}
