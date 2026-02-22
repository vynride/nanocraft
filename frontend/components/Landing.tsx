import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoIcon from "./LogoIcon";
import SEOHead from "./SEOHead";

interface LandingProps {
  onGenerate: (url: string) => void;
  error?: string | null;
}

const Landing: React.FC<LandingProps> = ({ onGenerate, error }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onGenerate(url);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <SEOHead
        title="Home"
        description="Transform any DIY URL into a pristine, visual-first learning guide using NanoCraft."
        keywords="DIY, instructables, visual guide, learning, maker, craft, tutorial, AI, step-by-step"
      />
      <header
        className="w-full px-8 py-8 flex justify-between items-center fixed top-0 left-0 z-10"
        role="banner"
      >
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <LogoIcon className="text-clay" size={28} />
          </div>
          <span className="text-2xl font-display tracking-wide text-off-white">
            NanoCraft
          </span>
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-6 relative">
        <div className="w-full max-w-2xl text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-display tracking-wide text-off-white leading-tight">
              The missing piece in
              <br />
              your DIY journey
            </h1>
            <p className="text-lg text-stone-light/60 font-light max-w-lg mx-auto leading-relaxed">
              Transform any DIY URL into a pristine, visual-first learning guide
              using NanoCraft.
            </p>
          </div>

          <section
            className="relative group max-w-xl mx-auto w-full"
            aria-labelledby="url-form-heading"
          >
            <h2 id="url-form-heading" className="sr-only">
              Generate Instructions
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              aria-label="Project URL form"
            >
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <span className="material-symbols-outlined text-stone-light/30">
                    link
                  </span>
                </div>
                <input
                  id="project-url"
                  name="project-url"
                  className="w-full py-4 pl-12 pr-4 bg-charcoal-dark border border-stone-light/10 focus:border-clay focus:ring-1 focus:ring-clay text-off-white placeholder:text-stone-light/20 font-light text-base rounded-lg transition-colors"
                  placeholder="https://www.instructables.com/id/Your-Project-Link"
                  aria-label="Paste project URL"
                  required
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-alert-red text-sm font-light">{error}</p>
              )}
              <button
                className="w-full clay-button text-charcoal-dark font-display px-8 py-4 text-xl tracking-wide rounded-lg hover:shadow-[0_0_15px_rgba(158,140,129,0.3)]"
                type="submit"
              >
                Generate DIY Instructions
              </button>
            </form>
            <div className="mt-8 flex justify-center opacity-60">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-light/40"></div>
            </div>
          </section>
        </div>

        {/* Background Dots */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #9E8C81 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </main>

      <footer
        className="w-full px-8 py-8 flex flex-col md:flex-row justify-between items-center border-t border-stone-light/5 bg-charcoal-bg/95 backdrop-blur-sm z-10"
        role="contentinfo"
      >
        <div className="text-[10px] uppercase tracking-widest text-clay mb-4 md:mb-0">
          © 2026 NanoCraft
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-clay">
              DIY REIMAGINED
            </span>
          </div>
          <div className="h-3 w-px bg-stone-light/10"></div>
          <div className="flex gap-6">
            <a
              className="text-[10px] uppercase tracking-widest text-stone-light/40 hover:text-clay transition-colors"
              href="https://github.com/vynride/NanoCraft"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <Link
              to="/terms"
              className="text-[10px] uppercase tracking-widest text-stone-light/40 hover:text-clay transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
