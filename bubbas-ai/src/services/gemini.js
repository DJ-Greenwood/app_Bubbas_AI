import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Default model - you can change this based on your needs
const defaultModel = 'gemini-2.0-flash';

// Generate a response from the AI
export const generateText = async (
    prompt, 
    history = [], 
    modelName = defaultModel
) => {
    try {
        const response = await genAI.models.generateContent({
            model: modelName,
            contents: prompt,
            parameters: {
                maxOutputTokens: 800,
                temperature: 0.7,
                topP: 0.8,
                topK: 40,
                context: history.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                })),
            },
        });

        return response.text;
    } catch (error) {
        console.error('Error generating text with Gemini:', error);
        throw error;
    }
};

// Generate a response with streaming
export const generateTextStream = async (
  prompt, 
  history = [], 
  onChunk, 
  modelName = defaultModel
) => {
  try {
    const model = initializeModel(modelName);
    
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    const result = await chat.sendMessageStream(prompt);
    let fullResponse = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      if (onChunk) onChunk(chunkText);
    }
    console.log(fullResponse);
    return fullResponse;
  } catch (error) {
    console.error('Error generating text stream with Gemini:', error);
    throw error;
  }
};
