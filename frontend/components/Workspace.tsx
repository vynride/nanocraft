import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Project, Step } from "../types";
import {
  fetchProject,
  sendChatMessage,
  ChatMessage,
} from "../services/apiService";
import { exportMarkdown, exportPDF } from "../services/exportService";
import LogoIcon from "./LogoIcon";
import SEOHead from "./SEOHead";

interface WorkspaceProps {
  project: Project;
}

const Workspace: React.FC<WorkspaceProps> = ({ project }) => {
  const navigate = useNavigate();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [steps, setSteps] = useState(project.steps);
  // Tracks steps ticked by clicking the row (separate from button-completed)
  const [rowChecked, setRowChecked] = useState<Set<number>>(new Set());
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentStep = steps[currentStepIdx];

  // Sidebar tab state
  const [activeTab, setActiveTab] = useState<"steps" | "chat">("steps");

  // Export dropdown state
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  // Track seen images
  const [seenImages, setSeenImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (steps[currentStepIdx]?.imageUrl) {
      setSeenImages((prev) => {
        if (prev.has(currentStepIdx)) return prev;
        const newSet = new Set(prev);
        newSet.add(currentStepIdx);
        return newSet;
      });
    }
  }, [currentStepIdx, steps]);

  // Poll for image updates
  useEffect(() => {
    const allImagesLoaded = steps.every((s) => s.imageUrl);
    if (allImagesLoaded) return;

    pollingRef.current = setInterval(async () => {
      try {
        const updated = await fetchProject(project.id);
        setSteps((prev) =>
          prev.map((s) => {
            const match = updated.steps.find(
              (u) => u.stepNumber === s.stepNumber,
            );
            return match?.imageUrl ? { ...s, imageUrl: match.imageUrl } : s;
          }),
        );

        if (updated.steps.every((s) => s.imageUrl)) {
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch (err) {
        console.warn("Image polling error:", err);
      }
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [project.id, steps]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // Focus input when switching to chat tab
  useEffect(() => {
    if (activeTab === "chat") {
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  }, [activeTab]);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStepCompletion = (idx: number) => {
    const newSteps = [...steps];
    newSteps[idx] = { ...newSteps[idx], isCompleted: !newSteps[idx].isCompleted };
    setSteps(newSteps);
  };

  // Mark current step complete, then advance to next
  const handleCompleteStep = () => {
    // Mark current step as completed (always, even if already true)
    const newSteps = [...steps];
    newSteps[currentStepIdx] = { ...newSteps[currentStepIdx], isCompleted: true };
    setSteps(newSteps);

    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handleSendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: message };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatError(null);
    setChatLoading(true);

    try {
      const response = await sendChatMessage(
        project.id,
        message,
        chatMessages,
      );
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: response,
      };
      setChatMessages([...updatedMessages, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setChatError("Failed to get a response. Please try again.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  const completedCount = steps.filter(
    (s, i) => s.isCompleted || rowChecked.has(i),
  ).length;

  const handleRowClick = (idx: number) => {
    if (idx !== currentStepIdx) {
      // First click: just navigate/expand the step, no tick
      setCurrentStepIdx(idx);
    } else {
      // Already expanded: toggle the row-level tick
      setRowChecked((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      });
    }
  };

  return (
    <div className="bg-workspace-bg text-stone-light min-h-screen flex flex-col font-sans antialiased overflow-hidden">
      <SEOHead
        title={project.title}
        description={`Interactive visual instruction guide for ${project.title}. Read the complete guide with interactive steps and AI assistance.`}
        image={project.visualAnchor}
      />

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header
        className="w-full px-5 py-3 flex justify-between items-center bg-charcoal-dark border-b border-white/5 h-14 shrink-0 z-20"
        role="banner"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-5 h-5 flex items-center justify-center">
              <LogoIcon className="text-clay" size={20} />
            </div>
            <span className="text-xl font-display tracking-wide text-off-white">
              NanoCraft
            </span>
          </Link>
          <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />
          <h1 className="text-xs font-light text-stone-light/70 tracking-wide truncate">
            {project.title}
          </h1>
        </div>

        {/* Export dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            onClick={() => setExportOpen((v) => !v)}
            className="flex items-center gap-1.5 bg-clay/10 hover:bg-clay/20 text-clay-muted hover:text-off-white px-3 py-1.5 text-xs uppercase tracking-widest border border-clay/20 transition-all rounded-sm"
          >
            Export
            <span className="material-symbols-outlined text-xs">
              arrow_drop_down
            </span>
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-panel-light border border-white/10 rounded-sm shadow-xl z-50 overflow-hidden">
              <button
                onClick={() => {
                  setExportOpen(false);
                  exportMarkdown({ ...project, steps });
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-stone-light/80 hover:bg-white/5 hover:text-off-white flex items-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-clay">
                  description
                </span>
                Export Markdown
              </button>
              <button
                onClick={() => {
                  setExportOpen(false);
                  exportPDF({ ...project, steps });
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-stone-light/80 hover:bg-white/5 hover:text-off-white flex items-center gap-2 transition-colors border-t border-white/5"
              >
                <span className="material-symbols-outlined text-sm text-clay">
                  picture_as_pdf
                </span>
                Export PDF
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Main layout ──────────────────────────────────────────────── */}
      <main className="flex-grow flex w-full h-[calc(100vh-3.5rem)] overflow-hidden">

        {/* ── Center: Image Visualizer ─────────────────────────────── */}
        <section className="flex-1 flex flex-col bg-workspace-bg relative overflow-hidden">
          {/* Step counter bar */}
          <div className="h-10 bg-workspace-bg border-b border-white/5 flex items-center px-5 justify-between shrink-0">
            <span className="text-xs text-stone-light/40 uppercase tracking-widest">
              Step {currentStepIdx + 1} of {steps.length}
            </span>
            <span className="text-xs text-stone-light/30">
              {completedCount}/{steps.length} complete
            </span>
          </div>

          {/* Canvas area */}
          <div className="flex-1 flex flex-col overflow-hidden relative bg-[#1A1A1A]">
            {/* Subtle grid background */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#9E8C81 1px, transparent 1px), linear-gradient(90deg, #9E8C81 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Card area */}
            <div className="flex-1 flex flex-col p-4 gap-3 overflow-hidden">

              {/* Image frame — same style as instruction box for consistency */}
              <div className="flex-1 min-h-0 bg-charcoal-dark border border-white/5 rounded-sm overflow-hidden flex flex-col">
                {/* Header label bar */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                  <span className="text-[9px] uppercase tracking-widest text-stone-light/30 pointer-events-none select-none">
                    Fig {currentStep.stepNumber} · Visual
                  </span>
                  {currentStep.imageUrl && (
                    <span className="text-[9px] uppercase tracking-widest text-green-600/50 select-none">
                      Ready
                    </span>
                  )}
                </div>

                {/* Image — fills remaining space */}
                <div
                  className="relative flex-1 min-h-0 bg-[#111]"
                >
                  {currentStep.imageUrl ? (
                    <img
                      src={currentStep.imageUrl}
                      alt={currentStep.altText}
                      className="w-full h-full object-contain" style={{ maxHeight: "100%" }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-2 border-clay/30 rounded-full" />
                        <div className="absolute inset-0 border-2 border-transparent border-t-clay rounded-full animate-spin" />
                      </div>
                      <p className="text-xs uppercase tracking-widest text-stone-light/30">
                        Generating visual…
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Instruction box ── */}
              <div className="shrink-0 bg-charcoal-dark border border-white/5 rounded-sm px-5 py-3.5">
                <p className="text-sm font-light text-stone-light/85 leading-relaxed">
                  {currentStep.sceneDescription}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sidebar ──────────────────────────────────────────────── */}
        <aside className="w-72 bg-panel-light flex flex-col border-l border-white/5 z-10 shrink-0">
          {/* Tab bar */}
          <div className="flex border-b border-white/5 shrink-0">
            <button
              onClick={() => setActiveTab("steps")}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-all ${activeTab === "steps"
                ? "text-clay border-b-2 border-clay bg-white/5"
                : "text-stone-light/40 hover:text-stone-light hover:bg-white/5"
                }`}
            >
              Steps
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-1.5 ${activeTab === "chat"
                ? "text-clay border-b-2 border-clay bg-white/5"
                : "text-stone-light/40 hover:text-stone-light hover:bg-white/5"
                }`}
            >
              <span className="material-symbols-outlined text-sm">
                smart_toy
              </span>
              Assistant
            </button>
          </div>

          {/* ── Steps panel ─────────────────────────────────────── */}
          {activeTab === "steps" && (
            <>
              <div className="flex-1 overflow-y-auto">
                {steps.map((step, idx) => {
                  const isButtonDone = step.isCompleted;
                  const isRowDone = rowChecked.has(idx);
                  const isAnyDone = isButtonDone || isRowDone;
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => handleRowClick(idx)}
                      className={`px-4 py-3.5 border-b border-white/5 cursor-pointer transition-all ${idx === currentStepIdx
                        ? "bg-white/[0.03] border-l-2 border-l-clay"
                        : isAnyDone
                          ? "opacity-35"
                          : "opacity-60 hover:opacity-100"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Step circle — clicking it toggles button-completion */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepCompletion(idx);
                          }}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium transition-colors ${isButtonDone
                            ? "bg-green-900/30 border-green-700/50 text-green-500"
                            : isRowDone
                              ? "bg-teal-900/20 border-teal-600/40 text-teal-400"
                              : "border-stone-light/20 text-stone-light/40 hover:border-clay/50"
                            }`}
                        >
                          {isButtonDone ? (
                            /* Solid green check — marked via Complete Step button */
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                              check
                            </span>
                          ) : isRowDone ? (
                            /* Outlined teal check — marked by clicking the row */
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0" }}>
                              check
                            </span>
                          ) : (
                            step.stepNumber
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-xs font-medium ${isAnyDone
                                ? "text-stone-light/40 line-through decoration-stone-light/40"
                                : "text-off-white"
                                }`}
                            >
                              Step {step.stepNumber}
                            </h3>
                            {!step.imageUrl ? (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-clay/50 animate-pulse"
                                title="Generating image…"
                              />
                            ) : !seenImages.has(idx) ? (
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-green-500/70"
                                title="Image ready"
                              />
                            ) : null}
                          </div>
                          {idx === currentStepIdx && (
                            <p className="text-[11px] text-stone-light/60 leading-snug line-clamp-2">
                              {step.sceneDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Complete Step / Finish button */}
              <div className="p-3 bg-panel-light border-t border-white/5 shrink-0">
                <button
                  onClick={handleCompleteStep}
                  disabled={currentStepIdx === steps.length - 1 && steps[currentStepIdx]?.isCompleted}
                  className="w-full clay-button bg-clay text-charcoal-dark hover:bg-off-white hover:text-charcoal px-4 py-2.5 font-medium text-xs tracking-wide rounded-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentStepIdx === steps.length - 1
                    ? "Finish Project"
                    : "Complete Step"}
                  <span className="material-symbols-outlined text-sm">
                    {currentStepIdx === steps.length - 1 ? "check_circle" : "arrow_forward"}
                  </span>
                </button>
              </div>
            </>
          )}

          {/* ── Chat panel ──────────────────────────────────────── */}
          {activeTab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.length === 0 && !chatLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-3 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-clay/10 border border-clay/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-clay text-lg">
                        smart_toy
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-off-white">
                        DIY Assistant
                      </p>
                      <p className="text-[11px] text-stone-light/50 leading-relaxed">
                        Ask me anything about this project — materials,
                        techniques, troubleshooting, or tips!
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                      {[
                        "What tools do I need?",
                        "Any safety tips?",
                        "Explain step 1",
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setChatInput(suggestion)}
                          className="text-[10px] uppercase tracking-widest px-2.5 py-1 border border-white/10 rounded-sm text-stone-light/50 hover:text-clay hover:border-clay/30 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] px-3 py-2 text-[12px] leading-relaxed rounded-lg ${msg.role === "user"
                        ? "bg-clay/20 text-off-white rounded-tr-none border border-clay/15"
                        : "bg-charcoal-dark/80 text-stone-light/90 rounded-tl-none border border-white/5"
                        }`}
                      style={{ wordBreak: "break-word" }}
                    >
                      {msg.role === "assistant" ? (
                        <div className="markdown-body space-y-1.5">
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => (
                                <p className="mb-1.5 last:mb-0" {...props} />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul className="list-disc pl-4 mb-1.5 last:mb-0" {...props} />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol className="list-decimal pl-4 mb-1.5 last:mb-0" {...props} />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="mb-0.5 last:mb-0" {...props} />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong className="font-semibold text-off-white" {...props} />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                      )}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-charcoal-dark/80 border border-white/5 rounded-lg rounded-tl-none px-3.5 py-2.5 flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 150, 300].map((delay) => (
                          <div
                            key={delay}
                            className="w-1.5 h-1.5 rounded-full bg-clay/60 animate-bounce"
                            style={{ animationDelay: `${delay}ms` }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-light/30">
                        Thinking…
                      </span>
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="flex justify-center">
                    <p className="text-xs text-red-400/80 bg-red-400/5 border border-red-400/10 rounded px-3 py-2">
                      {chatError}
                    </p>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-3 bg-panel-light border-t border-white/5 shrink-0">
                <div className="flex items-center gap-2 bg-charcoal-dark/60 border border-white/10 rounded-sm px-3 py-1 focus-within:border-clay/30 transition-colors">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Ask about this project…"
                    disabled={chatLoading}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-off-white placeholder:text-stone-light/30 py-2 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-1.5 text-clay hover:text-off-white disabled:text-stone-light/20 transition-colors disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-base">
                      send
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
};

export default Workspace;
