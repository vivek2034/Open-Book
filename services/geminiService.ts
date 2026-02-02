
import { GoogleGenAI, Type } from "@google/genai";
import { Genre, Story, StoryChapter } from "../types";

// Fallback for environments where crypto.randomUUID is not available (e.g., non-HTTPS local dev)
const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Safe access to API Key to prevent ReferenceError
const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env.API_KEY) || '';
  } catch {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const STORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy and atmospheric book title" },
    synopsis: { type: Type.STRING, description: "Detailed back-cover style summary (approx 150 words)" },
    plotOutline: { type: Type.STRING, description: "A detailed 10-point plot arc for a 20-chapter novel" },
    firstChapterTitle: { type: Type.STRING, description: "Title of chapter 1" },
    firstChapterContent: { type: Type.STRING, description: "The full first chapter (actual prose, not a summary, at least 1000 words)" }
  },
  required: ["title", "synopsis", "plotOutline", "firstChapterTitle", "firstChapterContent"]
};

const CHAPTER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Next chapter title" },
    content: { type: Type.STRING, description: "Full chapter content (immersive prose, approx 1200 words)" }
  },
  required: ["title", "content"]
};

export const geminiService = {
  generateNewStory: async (genre: Genre, country: string): Promise<Story & { plotOutline: string }> => {
    const prompt = `Act as a master novelist. Write the beginning of a long-form novel.
    Genre: ${genre}
    Setting: ${country}
    
    Instructions:
    1. Write in a sophisticated literary style with rich descriptions and immersive dialogue.
    2. Character names and cultural nuances must be strictly accurate to ${country}.
    3. Generate a complete hidden plot outline to ensure narrative consistency across 20+ chapters.
    4. Provide the full text for Chapter 1 as actual book prose. 
    5. The chapter must be substantial, approximately 1000 words.
    6. NO AUTHOR NAMES.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 15000 },
          responseMimeType: "application/json",
          responseSchema: STORY_SCHEMA
        }
      });

      if (!response.text) throw new Error("Empty response from Gemini");
      
      const data = JSON.parse(response.text);
      const storyId = generateId();
      
      return {
        id: storyId,
        title: data.title,
        genre,
        country,
        synopsis: data.synopsis,
        plotOutline: data.plotOutline,
        views: 0,
        createdAt: Date.now(),
        coverImage: `https://picsum.photos/seed/${storyId}/800/1200`,
        chapters: [{
          id: generateId(),
          title: data.firstChapterTitle,
          content: data.firstChapterContent,
          timestamp: Date.now()
        }]
      };
    } catch (error) {
      console.error("Gemini Generation Error (New Story):", error);
      throw error;
    }
  },

  generateNextChapter: async (story: Story & { plotOutline?: string }): Promise<StoryChapter> => {
    const lastChapter = story.chapters[story.chapters.length - 1];
    const chapterNumber = story.chapters.length + 1;
    
    const prompt = `Continue the novel "${story.title}".
    Current Chapter: ${chapterNumber}
    Genre: ${story.genre} | Setting: ${story.country}
    Master Plot Arc: ${story.plotOutline}
    
    Previous Chapter Ending: ${lastChapter.content.slice(-1500)}
    
    Write the next full chapter. Advance the plot according to the arc. Maintain character voices. 
    Write actual prose for a book, using dialogue and sensory details.
    Target length: 1200+ words.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 15000 },
          responseMimeType: "application/json",
          responseSchema: CHAPTER_SCHEMA
        }
      });

      if (!response.text) throw new Error("Empty response from Gemini");

      const data = JSON.parse(response.text);
      return {
        id: generateId(),
        title: data.title,
        content: data.content,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Gemini Generation Error (Next Chapter):", error);
      throw error;
    }
  }
};
