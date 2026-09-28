import { getAIConfig } from "./config.js";

export async function extractNutrition(imageData) {
  const { url, apiKey } = getAIConfig();

  if (!url || !apiKey) {
    throw new Error("AI configuration not set. Please configure the AI endpoint first.");
  }

  const prompt = `Extract the nutrition data from this food label image. Return a JSON object with the following structure:
{
  "name": "product name",
  "brand": "brand name",
  "servingSize": "serving size string",
  "nutritionPer100g": {
    "energyKj": number,
    "energyKcal": number,
    "fat": number,
    "saturatedFat": number,
    "carbohydrates": number,
    "sugars": number,
    "fiber": number,
    "protein": number,
    "salt": number
  }
}

Only return the JSON object, nothing else.`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageData.startsWith("data:") ? imageData : `data:image/jpeg;base64,${imageData}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AI API error: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  // Parse the JSON from the response
  try {
    // Try to find JSON in the response (sometimes there's markdown wrapping)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (e) {
    throw new Error(`Failed to parse AI response as JSON: ${content}`);
  }
}