
import React, { useEffect, useState } from 'react';

const Processing: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const logMessages = [
      "Initializing parsing engine...",
      "Connecting to neural grid...",
      "Scraping source metadata...",
      "> Detected 14 distinct steps",
      "Deconstructing logical flow...",
      "Extracting material list...",
      "Optimizing image assets...",
      "Finalizing visual workspace..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logMessages.length) {
        // Evaluate the message now to avoid closure issues with 'i'
        const currentMessage = logMessages[i];
        setLogs(prev => [...prev, currentMessage]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    const dotsInterval = setInterval(() => {
      setDots(d => (d.length < 3 ? d + '.' : ''));
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-charcoal-darkest text-stone-light flex flex-col antialiased">
      <header className="w-full px-8 py-6 flex justify-between items-center fixed top-0 left-0 z-20 bg-charcoal-darkest/90 backdrop-blur-sm border-b border-stone-light/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-stone-light/20 flex items-center justify-center bg-charcoal">
            <span className="material-symbols-outlined text-off-white text-lg">architecture</span>
          </div>
          <span className="text-2xl font-serif italic font-medium tracking-wide text-off-white">NanoCraft</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-2 w-2 rounded-full bg-clay animate-pulse"></div>
          <span className="text-xs uppercase tracking-widest text-stone-light/40">Processing{dots}</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-12 relative overflow-hidden pt-24">
        <div className="w-full max-w-lg space-y-8 z-10">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-serif text-off-white">Analyzing Structure</h2>
            <p className="text-stone-light/40 font-light">Deconstructing steps from source material...</p>
          </div>
          <div className="w-full h-px bg-stone-light/10 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-clay w-1/2 animate-[shimmer_2s_infinite]"></div>
          </div>
          <div className="font-mono text-xs space-y-2 text-stone-light/30 h-48 overflow-hidden relative">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-4 ${log && log.startsWith('>') ? 'text-clay/80' : ''}`}>
                <span className="text-stone-light/20">00:0{i + 1}</span>
                <span>{log}</span>
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-charcoal-darkest to-transparent"></div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#9E8C81 1px, transparent 1px), linear-gradient(90deg, #9E8C81 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </main>
    </div>
  );
};

export default Processing;
