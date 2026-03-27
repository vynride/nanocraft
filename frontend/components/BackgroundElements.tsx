import React from "react";

const BackgroundElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary Glow - Warmer Clay Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.025] blur-[120px]"
        style={{
          background: "radial-gradient(circle, #B99F8E 0%, transparent 70%)",
        }}
      />

      {/* Secondary Glows for Depth - Shifted towards warmer terracotta */}
      <div
        className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.02] blur-[100px] animate-pulse"
        style={{
          background: "radial-gradient(circle, #B99F8E 0%, transparent 70%)",
          animationDuration: "8s",
        }}
      />
      <div
        className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.015] blur-[80px] animate-pulse"
        style={{
          background: "radial-gradient(circle, #9E8C81 0%, transparent 70%)",
          animationDuration: "12s",
        }}
      />

      {/* Floating Geometric Elements */}
      <div
        className="absolute top-[20%] left-[15%] w-24 h-24 border border-clay/10 rounded-full animate-float opacity-[0.05]"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-[60%] right-[10%] w-32 h-32 border border-clay/5 rotate-45 animate-float opacity-[0.03]"
        style={{ animationDelay: "2s", animationDuration: "7s" }}
      />
      <div
        className="absolute bottom-[20%] left-[25%] w-16 h-16 border border-clay/10 rounded-sm -rotate-12 animate-float opacity-[0.04]"
        style={{ animationDelay: "4s", animationDuration: "9s" }}
      />

      {/* Subtle Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #9E8C81 1px, transparent 1px), 
                            linear-gradient(to bottom, #9E8C81 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
};

export default BackgroundElements;
