
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { Story, StoryChapter } from '../types';

export const StoryView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = React.useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (id) {
      const s = storageService.getStoryById(id);
      if (s) {
        setStory(s);
        storageService.incrementViews(id);
        storageService.updateLocalHistory({
          storyId: id,
          lastReadChapterId: s.chapters[s.chapters.length - 1].id,
          lastReadAt: Date.now()
        });
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

  const handleNextPart = async () => {
    if (!story || isGenerating) return;
    setIsGenerating(true);
    try {
      const nextChapter = await geminiService.generateNextChapter(story);
      const updatedStory = {
        ...story,
        chapters: [...story.chapters, nextChapter]
      };
      storageService.saveGlobalStory(updatedStory);
      setStory(updatedStory);
      storageService.updateLocalHistory({
        storyId: story.id,
        lastReadChapterId: nextChapter.id,
        lastReadAt: Date.now()
      });
      // Scroll to top of new content
      window.scrollTo({ top: contentRef.current?.offsetTop || 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Failed to generate next part. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Anti-copy effect
  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'u' || e.key === 's')) {
        e.preventDefault();
        alert("Copying text is disabled for writer protection.");
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!story) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-10 no-select">
      {/* Reader Header */}
      <header className="text-center space-y-4 pt-10">
        <span className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">
          {story.genre} • {story.country}
        </span>
        <h1 className="text-4xl md:text-5xl font-bold serif-text leading-tight">{story.title}</h1>
        <p className="text-slate-500 text-xs uppercase tracking-widest">Open Book AI Engine</p>
        <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full" />
      </header>

      {/* Chapters Content */}
      <div className="space-y-16" ref={contentRef}>
        {story.chapters.map((chapter, idx) => (
          <article key={chapter.id} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-4">
              <span className="text-slate-500 font-mono text-sm">CH {idx + 1}</span>
              <h2 className="text-xl font-bold text-slate-300">{chapter.title}</h2>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="serif-text text-lg md:text-xl leading-relaxed text-slate-300 space-y-6">
              {chapter.content.split('\n').map((para, pIdx) => (
                para.trim() ? <p key={pIdx}>{para}</p> : null
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Persistence / Sequel Prompter */}
      <div className="pt-10 pb-20 flex flex-col items-center gap-6">
        <div className="w-full h-px bg-slate-800" />
        <p className="text-slate-400 text-sm italic">You've reached the end of the current part.</p>
        <button 
          onClick={handleNextPart}
          disabled={isGenerating}
          className={`px-8 py-4 rounded-full font-bold transition-all shadow-xl flex items-center gap-3 ${
            isGenerating 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white scale-100 hover:scale-105 active:scale-95'
          }`}
        >
          {isGenerating ? (
            <>
              <span className="animate-spin text-xl">⏳</span>
              Writing Next Chapter...
            </>
          ) : (
            <>
              <span>✍️</span> Write Next Part
            </>
          )}
        </button>
        <p className="text-xs text-slate-500 text-center max-w-xs">
          Clicking "Write Next Part" will use AI to generate the next chapter based on previous events.
        </p>
      </div>
    </div>
  );
};
