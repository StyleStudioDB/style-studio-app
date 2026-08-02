import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { modelMode, source, count, aiDecide } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a professional fashion stylist AI. 
    Generate ${count} outfit recommendations for a user preferences:
    - Headwear/Model Styling: ${modelMode}
    - Outfit Source Strategy: ${source}
    - AI-Determined Brands: ${aiDecide ? 'Yes, suggest best matching luxury/streetwear brands' : 'Standard catalog'}

    Format output as structured JSON array of outfit objects containing:
    "id", "title", "items" (array of strings), "headwearNote", and "stylingTip".`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    return res.status(200).json({ result: textResponse });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
