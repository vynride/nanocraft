
import React, { useState } from 'react';
import { Project, Step } from '../types';

interface WorkspaceProps {
  project: Project;
  onExit: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ project, onExit }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [steps, setSteps] = useState(project.steps);
  const currentStep = steps[currentStepIdx];

  const toggleStepCompletion = (idx: number) => {
    const newSteps = [...steps];
    newSteps[idx].isCompleted = !newSteps[idx].isCompleted;
    setSteps(newSteps);
  };

  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  return (
    <div className="bg-workspace-bg text-stone-light min-h-screen flex flex-col font-sans antialiased overflow-hidden">
      {/* Header */}
      <header className="w-full px-6 py-4 flex justify-between items-center bg-charcoal-dark border-b border-white/5 h-16 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onExit} className="flex items-center gap-3 group">
            <div className="w-6 h-6 border border-stone-light/20 flex items-center justify-center bg-charcoal group-hover:border-clay transition-colors">
              <span className="material-symbols-outlined text-off-white text-sm">architecture</span>
            </div>
            <span className="text-2xl font-serif italic font-medium tracking-wide text-off-white">NanoCraft</span>
          </button>
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          <h1 className="text-sm font-light text-stone-light/80 tracking-wide truncate max-w-md">{project.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs text-stone-light/50 gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/70"></span>
            <span>Saved</span>
          </div>
          <button className="bg-clay/10 hover:bg-clay/20 text-clay-muted hover:text-off-white px-4 py-1.5 text-xs uppercase tracking-widest border border-clay/20 transition-all rounded-sm">
            Export
          </button>
          <div className="w-8 h-8 rounded-full bg-panel-light flex items-center justify-center text-stone-light/60 border border-white/5">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* Visualizer (Center Panel) */}
        <section className="flex-1 flex flex-col bg-workspace-bg relative overflow-hidden">
          <div className="h-12 bg-workspace-bg border-b border-white/5 flex items-center px-6 justify-between">
            <div className="flex items-center gap-1 bg-panel-light rounded p-1 border border-white/5">
              <button className="p-1.5 hover:bg-white/10 rounded text-stone-light/60 hover:text-white transition-colors" title="Select">
                <span className="material-symbols-outlined text-sm">arrow_selector_tool</span>
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded text-stone-light/60 hover:text-white transition-colors" title="Pan">
                <span className="material-symbols-outlined text-sm">pan_tool</span>
              </button>
              <button className="p-1.5 bg-white/10 rounded text-clay shadow-sm" title="Measure">
                <span className="material-symbols-outlined text-sm">straighten</span>
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-stone-light/40">
              <span>Scale 1:5</span>
              <div className="flex gap-1 items-center bg-panel-light px-2 py-1 rounded border border-white/5 cursor-pointer hover:border-white/20 hover:text-stone-light transition-colors">
                <span>Step {currentStepIdx + 1} of {steps.length}</span>
                <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative overflow-auto bg-[#1A1A1A]">
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#9E8C81 1px, transparent 1px), linear-gradient(90deg, #9E8C81 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="relative max-w-3xl w-full aspect-video bg-charcoal-dark border border-white/5 shadow-2xl rounded-sm p-8 flex flex-col items-center justify-center">
                <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-stone-light/30">
                  {`Figure ${currentStep.stepNumber}.1: Detail View`}
                </div>
                
                {/* Simulated Figure Content */}
                <div className="w-2/3 h-2/3 border border-dashed border-stone-light/20 relative rounded-sm flex items-center justify-center">
                  <div className="w-1/2 h-full border-r border-stone-light/10"></div>
                  <div className="absolute w-3/4 h-1/4 bg-stone-light/5 border border-stone-light/20 bottom-1/3"></div>
                  <div className="absolute -right-12 top-10 flex items-center">
                    <div className="w-8 h-px bg-clay"></div>
                    <span className="ml-2 text-xs text-clay font-mono">90°</span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-clay flex items-center justify-center cursor-pointer hover:bg-clay/10 transition-colors animate-pulse">
                    <div className="w-1.5 h-1.5 bg-clay rounded-full"></div>
                  </div>
                </div>

                <div className="absolute bottom-6 w-full px-8 text-center">
                  <p className="font-serif italic text-xl text-stone-light/90">
                    "{currentStep.altText}"
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-1 bg-panel-dark border border-white/5 rounded-sm shadow-lg">
              <button className="p-2 hover:bg-white/5 text-stone-light/60 hover:text-white transition-colors border-b border-white/5">
                <span className="material-symbols-outlined text-lg">add</span>
              </button>
              <button className="p-2 hover:bg-white/5 text-stone-light/60 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">remove</span>
              </button>
            </div>
          </div>
        </section>

        {/* Steps Sidebar */}
        <aside className="w-80 bg-panel-light flex flex-col border-l border-white/5 z-10 shrink-0">
          <div className="flex border-b border-white/5">
            <button className="flex-1 py-4 text-xs uppercase tracking-widest font-medium text-clay border-b-2 border-clay bg-white/5">
              Steps
            </button>
            <button className="flex-1 py-4 text-xs uppercase tracking-widest font-medium text-stone-light/40 hover:text-stone-light hover:bg-white/5 transition-all">
              AI Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {steps.map((step, idx) => (
              <div 
                key={step.stepNumber} 
                onClick={() => setCurrentStepIdx(idx)}
                className={`p-5 border-b border-white/5 cursor-pointer transition-all ${
                  idx === currentStepIdx ? 'bg-white/[0.02] border-l-2 border-l-clay opacity-100' : 
                  step.isCompleted ? 'opacity-40' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompletion(idx);
                    }}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-sans font-medium ${
                      step.isCompleted ? 'bg-green-900/30 border-green-700/50 text-green-500' : 'border-stone-light/20 text-stone-light/40'
                    }`}
                  >
                    {step.isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : step.stepNumber}
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className={`text-sm font-medium ${step.isCompleted ? 'text-stone-light/50 line-through decoration-stone-light/50' : 'text-off-white'}`}>
                      Step {step.stepNumber}
                    </h3>
                    {idx === currentStepIdx && (
                      <p className="text-xs text-stone-light/70 leading-loose">{step.sceneDescription}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-panel-light border-t border-white/5">
            <button 
              onClick={handleNextStep}
              className="w-full clay-button bg-clay text-charcoal-dark hover:bg-off-white hover:text-charcoal px-4 py-3 font-medium text-sm tracking-wide rounded-sm flex items-center justify-center gap-2 transition-all"
            >
              {currentStepIdx === steps.length - 1 ? 'Finish Project' : 'Complete Step'}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Workspace;
