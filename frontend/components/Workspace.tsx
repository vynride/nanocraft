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
import LogoIcon from "./LogoIcon";
import SEOHead from "./SEOHead";

interface WorkspaceProps {
  project: Project;
}

const Workspace: React.FC<WorkspaceProps> = ({ project }) => {
  const navigate = useNavigate();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [steps, setSteps] = useState(project.steps);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentStep = steps[currentStepIdx];

  // Sidebar tab state
  const [activeTab, setActiveTab] = useState<"steps" | "chat">("steps");

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

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

        // Stop polling if all images are loaded
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
        chatMessages, // send history *before* this message
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

  return (
    <div className="bg-workspace-bg text-stone-light min-h-screen flex flex-col font-sans antialiased overflow-hidden">
      <SEOHead
        title={project.title}
        description={`Interactive visual instruction guide for ${project.title}. Read the complete guide with interactive steps and AI assistance.`}
        image={project.visualAnchor}
      />
      {/* Header */}
      <header
        className="w-full px-6 py-4 flex justify-between items-center bg-charcoal-dark border-b border-white/5 h-16 shrink-0 z-20"
        role="banner"
      >
        <div className="flex items-center gap-4 flex-1">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-6 h-6 flex items-center justify-center">
              <LogoIcon className="text-clay" size={22} />
            </div>
            <span className="text-2xl font-display tracking-wide text-off-white">
              NanoCraft
            </span>
          </Link>
          <div className="h-4 w-px bg-white/10 mx-2 shrink-0"></div>
          <h1 className="text-sm font-light text-stone-light/80 tracking-wide">
            {project.title}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-clay/10 hover:bg-clay/20 text-clay-muted hover:text-off-white px-4 py-1.5 text-xs uppercase tracking-widest border border-clay/20 transition-all rounded-sm">
            Export
          </button>
        </div>
      </header>

      <main className="flex-grow flex w-full h-[calc(100vh-4rem)] overflow-hidden">
        {/* Visualizer (Center Panel) */}
        <section className="flex-1 flex flex-col bg-workspace-bg relative overflow-hidden">
          <div className="h-12 bg-workspace-bg border-b border-white/5 flex items-center px-6 justify-between">
            <div className="flex items-center gap-1 bg-panel-light"></div>
            <div className="flex items-center gap-4 text-xs text-stone-light/40">
              <div className="flex gap-1 items-center bg-panel-light px-2 py-1 rounded border border-white/5 cursor-pointer hover:border-white/20 hover:text-stone-light transition-colors">
                <span>
                  Step {currentStepIdx + 1} of {steps.length}
                </span>
                <span className="material-symbols-outlined text-xs">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative overflow-auto bg-[#1A1A1A]">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(#9E8C81 1px, transparent 1px), linear-gradient(90deg, #9E8C81 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <div className="relative max-w-3xl w-full aspect-video bg-charcoal-dark border border-white/5 shadow-2xl rounded-sm overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-stone-light/30">
                  {`Figure ${currentStep.stepNumber}.1: Detail View`}
                </div>

                {/* Image or Loading State */}
                {currentStep.imageUrl ? (
                  <img
                    src={currentStep.imageUrl}
                    alt={currentStep.altText}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-2 border-clay/30 rounded-full"></div>
                      <div className="absolute inset-0 border-2 border-transparent border-t-clay rounded-full animate-spin"></div>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-stone-light/30">
                      Generating visual…
                    </p>
                  </div>
                )}

                <div className="absolute bottom-6 w-full px-8 text-center">
                  <p className="font-light text-xl text-stone-light/90 bg-charcoal-dark/70 backdrop-blur-sm inline-block px-4 py-2 rounded">
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
                <span className="material-symbols-outlined text-lg">
                  remove
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-80 bg-panel-light flex flex-col border-l border-white/5 z-10 shrink-0">
          {/* Tab Buttons */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab("steps")}
              className={`flex-1 py-4 text-xs uppercase tracking-widest font-medium transition-all ${
                activeTab === "steps"
                  ? "text-clay border-b-2 border-clay bg-white/5"
                  : "text-stone-light/40 hover:text-stone-light hover:bg-white/5"
              }`}
            >
              Steps
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-4 text-xs uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === "chat"
                  ? "text-clay border-b-2 border-clay bg-white/5"
                  : "text-stone-light/40 hover:text-stone-light hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                smart_toy
              </span>
              DIY Assistant
            </button>
          </div>

          {/* Steps Panel */}
          {activeTab === "steps" && (
            <>
              <div className="flex-1 overflow-y-auto">
                {steps.map((step, idx) => (
                  <div
                    key={step.stepNumber}
                    onClick={() => setCurrentStepIdx(idx)}
                    className={`p-5 border-b border-white/5 cursor-pointer transition-all ${
                      idx === currentStepIdx
                        ? "bg-white/[0.02] border-l-2 border-l-clay opacity-100"
                        : step.isCompleted
                          ? "opacity-40"
                          : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepCompletion(idx);
                        }}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-sans font-medium ${
                          step.isCompleted
                            ? "bg-green-900/30 border-green-700/50 text-green-500"
                            : "border-stone-light/20 text-stone-light/40"
                        }`}
                      >
                        {step.isCompleted ? (
                          <span className="material-symbols-outlined text-sm">
                            check
                          </span>
                        ) : (
                          step.stepNumber
                        )}
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-sm font-medium ${step.isCompleted ? "text-stone-light/50 line-through decoration-stone-light/50" : "text-off-white"}`}
                          >
                            Step {step.stepNumber}
                          </h3>
                          {step.imageUrl ? (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-green-500/70"
                              title="Image ready"
                            ></span>
                          ) : (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-clay/50 animate-pulse"
                              title="Generating image..."
                            ></span>
                          )}
                        </div>
                        {idx === currentStepIdx && (
                          <p className="text-xs text-stone-light/70 leading-loose">
                            {step.sceneDescription}
                          </p>
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
                  {currentStepIdx === steps.length - 1
                    ? "Finish Project"
                    : "Complete Step"}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>
            </>
          )}

          {/* Chat Panel */}
          {activeTab === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Welcome message */}
                {chatMessages.length === 0 && !chatLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-4 opacity-60">
                    <div className="w-12 h-12 rounded-full bg-clay/10 border border-clay/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-clay text-xl">
                        smart_toy
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-off-white">
                        DIY Assistant
                      </p>
                      <p className="text-xs text-stone-light/50 leading-relaxed">
                        Ask me anything about this project — materials,
                        techniques, troubleshooting, or tips!
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                      {[
                        "What tools do I need?",
                        "Any safety tips?",
                        "Explain step 1",
                      ].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setChatInput(suggestion);
                          }}
                          className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white/10 rounded-sm text-stone-light/50 hover:text-clay hover:border-clay/30 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "bg-clay/20 text-off-white rounded-t-lg rounded-bl-lg border border-clay/15"
                          : "bg-charcoal-dark/80 text-stone-light/90 rounded-t-lg rounded-br-lg border border-white/5"
                      }`}
                      style={{
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.role === "assistant" ? (
                        <div className="markdown-body space-y-2">
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => (
                                <p className="mb-2 last:mb-0" {...props} />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc pl-4 mb-2 last:mb-0"
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  className="list-decimal pl-4 mb-2 last:mb-0"
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="mb-1 last:mb-0" {...props} />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong
                                  className="font-semibold text-off-white"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {msg.content}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-charcoal-dark/80 border border-white/5 rounded-t-lg rounded-br-lg px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-clay/60 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-clay/60 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-clay/60 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-stone-light/30">
                        Thinking…
                      </span>
                    </div>
                  </div>
                )}

                {/* Error */}
                {chatError && (
                  <div className="flex justify-center">
                    <p className="text-xs text-red-400/80 bg-red-400/5 border border-red-400/10 rounded px-3 py-2">
                      {chatError}
                    </p>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-panel-light border-t border-white/5">
                <div className="flex items-center gap-2 bg-charcoal-dark/60 border border-white/10 rounded-sm px-3 py-1 focus-within:border-clay/30 transition-colors">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Ask about this project…"
                    disabled={chatLoading}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-off-white placeholder:text-stone-light/30 py-2 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-1.5 text-clay hover:text-off-white disabled:text-stone-light/20 transition-colors disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">
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
