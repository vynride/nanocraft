import * as React from "react";
import { useState, useEffect } from "react";
import LogoIcon from "./LogoIcon";
import SEOHead from "./SEOHead";

const Processing: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [dots, setDots] = useState("");

  const logMessages = [
    "Initializing parsing engine...",
    "Connecting to neural grid...",
    "Scraping source metadata...",
    "Detected distinct steps",
    "Deconstructing logical flow...",
    "Extracting material list...",
    "Optimizing image assets...",
    "Finalizing visual workspace...",
    "Generating final guide...",
  ];

  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < logMessages.length) {
        const currentMessage = logMessages[i];
        setLogs((prev) => [...prev, currentMessage]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length < 3 ? d + "." : ""));
    }, 400);

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
    };
  }, []);

  const progress = (logs.length / logMessages.length) * 100;

  return (
    <div className="min-h-screen bg-charcoal-darkest text-stone-light flex flex-col antialiased">
      <SEOHead
        title="Processing Guide"
        description="Analyzing and restructuring your DIY guide via AI..."
      />
      <header
        className="w-full px-8 py-6 flex justify-between items-center fixed top-0 left-0 z-20 bg-charcoal-darkest/90 backdrop-blur-sm border-b border-stone-light/5"
        role="banner"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <LogoIcon className="text-clay" size={28} />
          </div>
          <span className="text-2xl font-display tracking-wide text-off-white">
            NanoCraft
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-2 w-2 rounded-full bg-clay animate-pulse"></div>
          <span className="text-xs uppercase tracking-widest text-stone-light/40 flex items-center">
            Processing
            <span className="inline-block w-8 ml-1">{dots}</span>
          </span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-12 relative overflow-hidden pt-24">
        <div className="w-full max-w-lg space-y-8 z-10">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-display text-off-white">
              Analyzing Structure
            </h2>
            <p className="text-stone-light/40 font-light">
              Deconstructing steps from source material...
            </p>
          </div>
          <div className="w-full h-px bg-stone-light/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-clay transition-all duration-700 ease-out animate-[shimmer_2s_infinite]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="relative group">
            <div
              ref={scrollRef}
              className="font-mono text-xs space-y-3 text-stone-light/30 h-56 overflow-y-auto relative pb-12 scroll-smooth"
              aria-live="polite"
              aria-atomic="false"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${log && log.startsWith(">") ? "text-clay/80" : ""}`}
                >
                  <span className="text-stone-light/20">
                    00:{String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{log}</span>
                </div>
              ))}
              {/* Spacer to allow last log to scroll past the gradient */}
              <div className="h-20" />
            </div>
            {/* Top Fade */}
            <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-charcoal-darkest to-transparent pointer-events-none z-10"></div>
            {/* Bottom Fade */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal-darkest via-charcoal-darkest/80 to-transparent pointer-events-none z-10"></div>
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#9E8C81 1px, transparent 1px), linear-gradient(90deg, #9E8C81 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </main>
    </div>
  );
};

export default Processing;
