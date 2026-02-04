import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Simulates a dealer or opponent commenting on the game state
export const getDealerCommentary = async (game: string, outcome: 'win' | 'loss' | 'neutral', amount: number): Promise<string> => {
  if (!apiKey) return outcome === 'win' ? "Great win!" : "Better luck next time.";

  try {
    const prompt = `
      You are a charismatic, witty casino dealer in a cyberpunk casino called NeonVegas.
      The player is playing ${game}.
      The player just experienced a ${outcome} of $${amount}.
      Give a short, punchy, 1-sentence comment reacting to this.
      If they won, congratulate them but tempt them to bet more.
      If they lost, be sympathetic but encourage a retry.
      Keep it under 15 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || "Spin to win!";
  } catch (error) {
    console.error("AI Error", error);
    return outcome === 'win' ? "Luck is on your side!" : "The house always wins... eventually.";
  }
};

// Strategic AI for Ludo/Games
export const getAIStrategyMove = async (gameStateDescription: string): Promise<number> => {
   // In a real implementation, this would take the board state and decide the best move.
   // Here we use it to generate a "randomness" factor seeded by AI reasoning for "fairness" simulation.
   if (!apiKey) return Math.floor(Math.random() * 6) + 1;

   try {
     const prompt = `
       Analyze this game state: ${gameStateDescription}.
       Return a single integer between 1 and 6 representing a dice roll or decision index.
       Return ONLY the number.
     `;
     const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
     });
     const num = parseInt(response.text?.trim() || "0");
     return isNaN(num) ? Math.floor(Math.random() * 6) + 1 : num;
   } catch (e) {
     return Math.floor(Math.random() * 6) + 1;
   }
}
