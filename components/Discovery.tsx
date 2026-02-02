
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Genre } from '../types';
import { GENRES, COUNTRIES, TONES, SETTINGS } from '../constants';
import { geminiService } from '../services/geminiService';
import { storageService } from '../services/storageService';

export const Discovery: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    genre: Genre.ROMANCE,
    country: 'Japan',
    tone: 'Heartwarming',
    setting: 'Modern City'
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => Math.max(0, s - 1));

  const generate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const story = await geminiService.generateNewStory(formData.genre, formData.country);
      storageService.saveGlobalStory(story);
      navigate(`/story/${story.id}`);
    } catch (err: any) {
      console.error("Generation failed:", err);
      // Provide more specific feedback if possible
      const message = err.message?.includes('401') 
        ? "Invalid API Key. Please check your environment variables." 
        : "Failed to generate story. Check your internet connection or console for errors.";
      setErrorMsg(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const Progress = () => (
    <div className="flex gap-2 mb-10">
      {[0,1,2,3].map(i => (
        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-500' : 'bg-slate-800'}`} />
      ))}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto py-10">
      {isGenerating ? (
        <div className="text-center space-y-8 animate-pulse">
          <div className="text-6xl">📖</div>
          <h2 className="text-2xl font-bold">Summoning the Muses...</h2>
          <p className="text-slate-400">Crafting characters, building worlds, and writing your masterpiece from scratch.</p>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]" style={{width: '60%'}} />
          </div>
        </div>
      ) : (
        <>
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2">Discovery Wizard</h2>
            <p className="text-slate-400">Can't decide? Let's build your perfect read.</p>
          </header>

          <Progress />

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm min-h-[400px] flex flex-col">
            {step === 0 && (
              <div className="flex-1 space-y-6">
                <h3 className="text-xl font-medium">Which genre do you crave today?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {GENRES.map(g => (
                    <button 
                      key={g}
                      onClick={() => setFormData({...formData, genre: g})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.genre === g ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="flex-1 space-y-6">
                <h3 className="text-xl font-medium">Where should the story take place?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {COUNTRIES.map(c => (
                    <button 
                      key={c}
                      onClick={() => setFormData({...formData, country: c})}
                      className={`p-3 rounded-xl border-2 text-sm transition-all ${
                        formData.country === c ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-1 space-y-6">
                <h3 className="text-xl font-medium">What's the emotional tone?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {TONES.map(t => (
                    <button 
                      key={t}
                      onClick={() => setFormData({...formData, tone: t})}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.tone === t ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex-1 space-y-6">
                <h3 className="text-xl font-medium">Ready to start your journey?</h3>
                <div className="bg-slate-800/50 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Genre</span>
                    <span className="font-bold">{formData.genre}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Location</span>
                    <span className="font-bold">{formData.country}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700 pb-2">
                    <span className="text-slate-400">Tone</span>
                    <span className="font-bold">{formData.tone}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic">"Character names and cultural nuances will be tailored to {formData.country} automatically."</p>
              </div>
            )}

            <div className="flex justify-between mt-10 pt-6 border-t border-slate-800">
              <button 
                onClick={handleBack}
                disabled={step === 0}
                className="px-6 py-2 text-slate-400 hover:text-white disabled:opacity-0"
              >
                Back
              </button>
              {step < 3 ? (
                <button 
                  onClick={handleNext}
                  className="px-10 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/20"
                >
                  Continue
                </button>
              ) : (
                <button 
                  onClick={generate}
                  className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full font-bold hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
                >
                  Generate Story
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
