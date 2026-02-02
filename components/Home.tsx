
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { Story } from '../types';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [trending, setTrending] = useState<Story[]>([]);
  const [recent, setRecent] = useState<Story[]>([]);

  useEffect(() => {
    const all = storageService.getGlobalStories();
    setTrending([...all].sort((a, b) => b.views - a.views).slice(0, 5));
    setRecent([...all].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10));
  }, []);

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold">Discover</h2>
        <p className="text-slate-400">Handcrafted by AI, enjoyed by you.</p>
      </header>

      {/* Hero Section / Trending */}
      <section>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="text-orange-400">🔥</span> Trending Now
        </h3>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {trending.length > 0 ? trending.map(story => (
            <Link 
              key={story.id} 
              to={`/story/${story.id}`}
              className="min-w-[280px] md:min-w-[320px] group snap-start"
            >
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-2xl ring-1 ring-white/10">
                <img 
                  src={story.coverImage} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-blue-500 px-2 py-1 rounded mb-2 inline-block">
                    {story.genre}
                  </span>
                  <h4 className="text-lg font-bold leading-tight">{story.title}</h4>
                </div>
              </div>
            </Link>
          )) : (
            <div className="w-full h-48 flex items-center justify-center bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800 text-slate-500">
              No stories generated yet. Be the first!
            </div>
          )}
        </div>
      </section>

      {/* Grid List / New */}
      <section>
        <h3 className="text-xl font-semibold mb-6">New Releases</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {recent.map(story => (
            <Link key={story.id} to={`/story/${story.id}`} className="group">
              <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 shadow-lg ring-1 ring-white/5 bg-slate-800">
                <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
              </div>
              <h4 className="text-sm font-semibold truncate group-hover:text-blue-400 transition-colors">{story.title}</h4>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-tighter">AI Generated</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
