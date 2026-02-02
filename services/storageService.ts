
import { Story, LocalHistory } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * ARCHITECTURE FOR MONGODB:
 * 
 * 1. MONGODB ATLAS DATA API (Easiest for Frontend):
 *    - Go to Atlas -> Data API -> Enable.
 *    - Use fetch() to POST to your Atlas endpoint.
 *    - You will need your Atlas App ID and an API Key.
 * 
 * 2. SERVERLESS (Vercel Functions):
 *    - Create /api/stories.ts
 *    - Use the 'mongodb' Node.js driver.
 *    - Connect using process.env.MONGODB_URI.
 * 
 * CURRENT IMPLEMENTATION: 
 * We use localStorage for immediate local testing, but the structure 
 * below is ready to be swapped for async fetch() calls.
 */

export const storageService = {
  getGlobalStories: (): Story[] => {
    const data = localStorage.getItem(STORAGE_KEYS.GLOBAL_STORIES);
    return data ? JSON.parse(data) : [];
  },

  saveGlobalStory: (story: Story) => {
    const stories = storageService.getGlobalStories();
    const existingIndex = stories.findIndex(s => s.id === story.id);
    if (existingIndex > -1) {
      stories[existingIndex] = story;
    } else {
      stories.unshift(story);
    }
    localStorage.setItem(STORAGE_KEYS.GLOBAL_STORIES, JSON.stringify(stories));
  },

  getStoryById: (id: string): Story | undefined => {
    return storageService.getGlobalStories().find(s => s.id === id);
  },

  incrementViews: (id: string) => {
    const stories = storageService.getGlobalStories();
    const story = stories.find(s => s.id === id);
    if (story) {
      story.views += 1;
      localStorage.setItem(STORAGE_KEYS.GLOBAL_STORIES, JSON.stringify(stories));
    }
  },

  getLocalHistory: (): LocalHistory[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOCAL_HISTORY);
    return data ? JSON.parse(data) : [];
  },

  updateLocalHistory: (history: LocalHistory) => {
    const current = storageService.getLocalHistory();
    const filtered = current.filter(h => h.storyId !== history.storyId);
    filtered.unshift(history);
    localStorage.setItem(STORAGE_KEYS.LOCAL_HISTORY, JSON.stringify(filtered.slice(0, 50)));
  }
};
