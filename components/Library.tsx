
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { Story, LocalHistory } from '../types';
import { Link } from 'react-router-dom';

export const Library: React.FC = () => {
  const [history, setHistory] = useState<(Story & { lastReadAt: number })[]>([]);

  useEffect(() => {
    const localHist = storageService.getLocalHistory();
    const globalStories = storageService.getGlobalStories();
    
    const enriched = localHist.map(h => {
      const story = globalStories.find(s => s.id === h.storyId);
      return story ? { ...story, lastReadAt: h.lastReadAt } : null;
    }).filter(s => s !== null) as (Story & { lastReadAt: number })[];

    setHistory(enriched);
  }, []);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold">My Library</h2>
        <p className="text-slate-400">Continue where you left off.</p>
      </header>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map(story => (
            <Link 
              key={story.id} 
              to={`/story/${story.id}`}
              className="flex gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-slate-800">
                <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col py-2">
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {story.genre}
                  </span>
                  <h4 className="font-bold text-lg leading-tight mt-1 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {story.title}
                  </h4>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{story.synopsis}</p>
                </div>
                <div className="text-xs text-slate-600 mt-4 flex items-center gap-2">
                  <span>📖 {story.chapters.length} Chapters</span>
                  <span>•</span>
                  <span>Read {new Date(story.lastReadAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 border-2 border-dashed border-slate-800 rounded-3xl">
          <div className="text-5xl mb-6 opacity-20">📚</div>
          <h3 className="text-xl font-bold mb-2">No Stories Yet</h3>
          <p className="text-slate-500 mb-8 max-w-xs mx-auto">
            Your reading history will appear here once you start exploring novels.
          </p>
          <Link to="/discovery" className="px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500">
            Start Discovery
          </Link>
        </div>
      )}
    </div>
  );
};
