
import React from 'react';
import { Project } from '../types';

interface LibraryProps {
  onNewProject: () => void;
  onOpenProject: (p: Project) => void;
}

const Library: React.FC<LibraryProps> = ({ onNewProject, onOpenProject }) => {
  return (
    <div className="bg-charcoal-dark text-stone-light min-h-screen flex flex-col font-sans antialiased">
      <header className="w-full px-8 py-8 flex justify-between items-center fixed top-0 left-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-stone-light/20 flex items-center justify-center bg-charcoal">
            <span className="material-symbols-outlined text-off-white text-lg">architecture</span>
          </div>
          <span className="text-2xl font-serif italic font-medium tracking-wide text-off-white">NanoCraft</span>
        </div>
        <nav className="flex items-center gap-6">
          <button className="w-8 h-8 flex items-center justify-center text-stone-light/40 hover:text-off-white transition-colors">
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-stone-light/40 hover:text-off-white transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-clay/20 border border-stone-light/10 flex items-center justify-center text-xs text-clay">
            AI
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col px-6 pt-24 pb-12 relative w-full max-w-7xl mx-auto">
        <div className="absolute left-8 top-32 hidden lg:block w-48 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-stone-light/30 mb-3">Library</p>
            <a className="block text-sm text-off-white font-medium border-l-2 border-clay pl-3 py-1" href="#">My Projects</a>
            <a className="block text-sm text-stone-light/40 hover:text-stone-light pl-3.5 py-1 transition-colors" href="#">Shared</a>
            <a className="block text-sm text-stone-light/40 hover:text-stone-light pl-3.5 py-1 transition-colors" href="#">Archived</a>
          </div>
        </div>

        <div className="flex-grow flex items-center justify-center lg:pl-48">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-serif font-normal tracking-wide text-off-white mb-4">
                Your workspace is empty.
              </h1>
              <p className="text-stone-dim font-light text-base max-w-md mx-auto">
                Start your first crafting journey by importing a guide or creating a custom project structure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div 
                onClick={onNewProject}
                className="group relative bg-charcoal/50 hover:bg-charcoal border border-stone-light/10 hover:border-clay/30 p-8 flex flex-col items-center text-center transition-all duration-300 cursor-pointer min-h-[240px] justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-charcoal-dark border border-stone-light/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-clay text-2xl">link</span>
                </div>
                <h3 className="text-lg font-serif italic text-off-white mb-2">Import from URL</h3>
                <p className="text-sm text-stone-light/40 font-light mb-6 px-4">Paste a link from Instructables, YouTube, or any DIY blog.</p>
              </div>

              <div className="group relative border border-dashed border-stone-light/10 hover:bg-charcoal/30 p-8 flex flex-col items-center text-center transition-all duration-300 cursor-pointer min-h-[240px] justify-center">
                <div className="w-12 h-12 rounded-full bg-charcoal-dark border border-stone-light/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-stone-dim group-hover:text-off-white text-2xl transition-colors">add</span>
                </div>
                <h3 className="text-lg font-serif italic text-stone-dim group-hover:text-off-white mb-2 transition-colors">Create Blank Project</h3>
                <p className="text-sm text-stone-light/40 font-light px-4">Build your own learning structure from scratch using AI blocks.</p>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-charcoal border border-stone-light/5 rounded-full">
                <span className="material-symbols-outlined text-clay text-sm">tips_and_updates</span>
                <span className="text-xs text-stone-light/60 tracking-wide">Tip: You can drag and drop PDF manuals directly here.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 pointer-events-none z-[-1] opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </main>

      <footer className="w-full px-8 py-6 flex justify-between items-center border-t border-stone-light/5 bg-charcoal-dark/90 backdrop-blur-sm z-10 text-[10px] text-stone-light/30 uppercase tracking-widest">
        <div>NanoCraft Systems v2.1</div>
        <div className="flex gap-4">
          <span className="hover:text-clay cursor-pointer transition-colors">Help Center</span>
          <span className="hover:text-clay cursor-pointer transition-colors">Keyboard Shortcuts</span>
        </div>
      </footer>
    </div>
  );
};

export default Library;
