import { GoogleGenAI, Type, Schema } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is not set in environment variables!");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export interface AIParsedCV {
  ai_score: number;
  ai_summary: string;
  strengths: string[];
  gaps: string[];
  soft_skills: string[];
}

const CVSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ai_score: {
      type: Type.INTEGER,
      description: "Un número de 0 a 100 que evalúa qué tan bien se ajusta el candidato a la vacante.",
    },
    ai_summary: {
      type: Type.STRING,
      description: "Un resumen ejecutivo de 2 o 3 oraciones sobre el perfil del candidato destacando por qué es o no es adecuado.",
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 2 a 5 fortalezas clave técnicas o de experiencia alineadas con la vacante.",
    },
    gaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 0 a 4 brechas, requisitos faltantes o áreas de mejora respecto a la vacante.",
    },
    soft_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Lista de 2 a 5 habilidades blandas (ej. Liderazgo, Comunicación) deducidas del CV.",
    },
  },
  required: ["ai_score", "ai_summary", "strengths", "gaps", "soft_skills"],
};

export async function parseCVWithGemini(cvText: string, vacancyTitle: string, vacancyDescription: string): Promise<AIParsedCV> {
  const prompt = `
Eres un reclutador experto y objetivo de Inteligencia Artificial.
Tu tarea es analizar el siguiente Currículum Vitae y evaluar qué tan bien encaja con la vacante descrita.

### Detalles de la Vacante:
- Título: ${vacancyTitle}
- Descripción: ${vacancyDescription}

### Texto Extraído del CV:
${cvText}

Por favor, analiza el texto del CV e identifica la información solicitada en el formato JSON especificado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: CVSchema,
        temperature: 0.2, // Low temperature for consistent analytical results
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Respuesta vacía de Gemini");
    }

    const parsedData = JSON.parse(responseText) as AIParsedCV;
    return parsedData;
  } catch (error) {
    console.error("Error parsing CV with Gemini:", error);
    // Return a fallback so the application doesn't completely fail
    return {
      ai_score: 50,
      ai_summary: "No se pudo realizar el análisis profundo con IA debido a un error técnico.",
      strengths: ["Lectura del CV pendiente"],
      gaps: ["No se pudo determinar el ajuste"],
      soft_skills: ["No evaluado"]
    };
  }
}
