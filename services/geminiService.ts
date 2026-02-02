
import { GoogleGenAI, Type } from "@google/genai";
import { Genre, Story, StoryChapter } from "../types";

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

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
    title: { type: Type.STRING, description: "Catchy book title" },
    synopsis: { type: Type.STRING, description: "Back-cover style summary" },
    plotOutline: { type: Type.STRING, description: "A detailed 10-point plot arc" },
    firstChapterTitle: { type: Type.STRING, description: "Title of chapter 1" },
    firstChapterContent: { type: Type.STRING, description: "The full first chapter prose (min 800 words)" }
  },
  required: ["title", "synopsis", "plotOutline", "firstChapterTitle", "firstChapterContent"]
};

const CHAPTER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Next chapter title" },
    content: { type: Type.STRING, description: "Full chapter content (min 800 words)" }
  },
  required: ["title", "content"]
};

export const geminiService = {
  generateNewStory: async (genre: Genre, country: string): Promise<Story & { plotOutline: string }> => {
    const prompt = `Act as a novelist. Write the start of a novel in ${genre} set in ${country}. 
    Ensure cultural accuracy for names and setting. 
    Write the first chapter as actual prose, not a summary.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: STORY_SCHEMA
        }
      });

      const data = JSON.parse(response.text || '{}');
      const storyId = generateId();
      
      return {
        id: storyId,
        title: data.title || "Untitled Masterpiece",
        genre,
        country,
        synopsis: data.synopsis || "No synopsis provided.",
        plotOutline: data.plotOutline || "Linear progression.",
        views: 0,
        createdAt: Date.now(),
        coverImage: `https://picsum.photos/seed/${storyId}/800/1200`,
        chapters: [{
          id: generateId(),
          title: data.firstChapterTitle || "Chapter 1",
          content: data.firstChapterContent || "The story begins...",
          timestamp: Date.now()
        }]
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  },

  generateNextChapter: async (story: Story & { plotOutline?: string }): Promise<StoryChapter> => {
    const lastChapter = story.chapters[story.chapters.length - 1];
    const prompt = `Continue the novel "${story.title}". Genre: ${story.genre}. Setting: ${story.country}. 
    Master Plot Arc: ${story.plotOutline}. Write the next full chapter.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: CHAPTER_SCHEMA
        }
      });

      const data = JSON.parse(response.text || '{}');
      return {
        id: generateId(),
        title: data.title || `Chapter ${story.chapters.length + 1}`,
        content: data.content || "The journey continues...",
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
};