"use client";

// Cosmic decorative elements - stars, sparkles, and floating shapes
// Uses CSS-only animations for performance

export function CosmicElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Stars along the right side */}
      <div className="absolute top-[10%] right-[5%] text-white/20 text-[12px] animate-twinkle" style={{ animationDelay: '0s' }}>✦</div>
      <div className="absolute top-[18%] right-[8%] text-white/30 text-[8px] animate-twinkle-slow" style={{ animationDelay: '0.5s' }}>✦</div>
      <div className="absolute top-[25%] right-[3%] text-white/25 text-[16px] animate-twinkle" style={{ animationDelay: '1s' }}>✦</div>
      <div className="absolute top-[35%] right-[6%] text-white/20 text-[10px] animate-twinkle-slow" style={{ animationDelay: '1.5s' }}>✦</div>
      <div className="absolute top-[45%] right-[4%] text-white/35 text-[14px] animate-twinkle" style={{ animationDelay: '2s' }}>✦</div>
      <div className="absolute top-[55%] right-[7%] text-white/20 text-[9px] animate-twinkle-slow" style={{ animationDelay: '2.5s' }}>✦</div>
      <div className="absolute top-[65%] right-[5%] text-white/30 text-[18px] animate-twinkle" style={{ animationDelay: '3s' }}>✦</div>
      <div className="absolute top-[75%] right-[9%] text-white/25 text-[11px] animate-twinkle-slow" style={{ animationDelay: '0.3s' }}>✦</div>
      <div className="absolute top-[85%] right-[4%] text-white/20 text-[13px] animate-twinkle" style={{ animationDelay: '1.8s' }}>✦</div>
      
      {/* Stars scattered throughout */}
      <div className="absolute top-[12%] left-[15%] text-white/15 text-[10px] animate-twinkle-slow" style={{ animationDelay: '0.7s' }}>✦</div>
      <div className="absolute top-[28%] left-[25%] text-white/20 text-[8px] animate-twinkle" style={{ animationDelay: '1.2s' }}>✦</div>
      <div className="absolute top-[42%] left-[10%] text-white/25 text-[12px] animate-twinkle-slow" style={{ animationDelay: '2.2s' }}>✦</div>
      <div className="absolute top-[58%] left-[30%] text-white/15 text-[9px] animate-twinkle" style={{ animationDelay: '0.9s' }}>✦</div>
      <div className="absolute top-[72%] left-[20%] text-white/20 text-[14px] animate-twinkle-slow" style={{ animationDelay: '1.6s' }}>✦</div>
      <div className="absolute top-[88%] left-[35%] text-white/30 text-[10px] animate-twinkle" style={{ animationDelay: '2.8s' }}>✦</div>
      
      {/* Center scattered stars */}
      <div className="absolute top-[20%] left-[50%] text-white/15 text-[8px] animate-twinkle-slow" style={{ animationDelay: '0.4s' }}>✦</div>
      <div className="absolute top-[40%] left-[45%] text-white/20 text-[11px] animate-twinkle" style={{ animationDelay: '1.4s' }}>✦</div>
      <div className="absolute top-[60%] left-[55%] text-white/25 text-[9px] animate-twinkle-slow" style={{ animationDelay: '2.4s' }}>✦</div>
      <div className="absolute top-[80%] left-[48%] text-white/15 text-[13px] animate-twinkle" style={{ animationDelay: '0.6s' }}>✦</div>
      
      {/* Left side sparse stars */}
      <div className="absolute top-[15%] left-[3%] text-white/20 text-[10px] animate-twinkle" style={{ animationDelay: '1.1s' }}>✦</div>
      <div className="absolute top-[50%] left-[2%] text-white/25 text-[8px] animate-twinkle-slow" style={{ animationDelay: '2.1s' }}>✦</div>
      <div className="absolute top-[70%] left-[5%] text-white/15 text-[12px] animate-twinkle" style={{ animationDelay: '0.8s' }}>✦</div>
      
      {/* Floating shapes - circle */}
      <div 
        className="absolute top-[30%] right-[12%] w-3 h-3 rounded-full bg-violet-500/20 animate-levitate"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="absolute top-[60%] left-[8%] w-4 h-4 rounded-full bg-indigo-500/15 animate-levitate-slow"
        style={{ animationDelay: '1s' }}
      />
      <div 
        className="absolute top-[80%] right-[15%] w-2 h-2 rounded-full bg-pink-500/20 animate-levitate"
        style={{ animationDelay: '2s' }}
      />
      
      {/* Floating shapes - squares */}
      <div 
        className="absolute top-[22%] left-[12%] w-2 h-2 bg-cyan-500/15 rotate-45 animate-levitate-slow"
        style={{ animationDelay: '0.5s' }}
      />
      <div 
        className="absolute top-[48%] right-[10%] w-3 h-3 bg-violet-500/20 rotate-12 animate-levitate"
        style={{ animationDelay: '1.5s' }}
      />
      <div 
        className="absolute top-[90%] left-[40%] w-2 h-2 bg-indigo-500/15 rotate-45 animate-levitate-slow"
        style={{ animationDelay: '2.5s' }}
      />
      
      {/* Subtle gradient orbs */}
      <div 
        className="absolute top-[15%] right-[20%] w-32 h-32 bg-violet-600/5 rounded-full blur-3xl animate-pulse-soft"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="absolute top-[50%] left-[5%] w-24 h-24 bg-indigo-600/5 rounded-full blur-3xl animate-pulse-soft"
        style={{ animationDelay: '2s' }}
      />
      <div 
        className="absolute top-[75%] right-[8%] w-20 h-20 bg-pink-600/5 rounded-full blur-3xl animate-pulse-soft"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}
