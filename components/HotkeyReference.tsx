import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Skull, Grid, Zap, Layers, Shield, Brain, Target, Compass, MessageSquare, AlertTriangle, X } from 'lucide-react';

// Helper Icon for T Strategy
const SwordsIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
    <path d="m13 19 6-6" />
    <path d="M16 16 20 20" />
    <path d="M19 21 21 19" />
  </svg>
);

interface HotkeyReferenceProps {
  activeHotkeys?: string[];
  className?: string;
  onClose?: () => void;
}

const categories = [
  {
    id: 'D',
    title: "Devil's Advocate",
    icon: <Skull size={14} />,
    color: 'text-devil-400',
    bgColor: 'bg-devil-950/30',
    borderColor: 'border-devil-900/50',
    items: [
      { code: 'D11', label: '60-Sec Snapshot', desc: 'Quick risk overview' },
      { code: 'D12', label: 'Opposition Brief', desc: 'Counterarguments' },
      { code: 'D21', label: 'Risk Deep-Dive', desc: 'Detailed scenarios' },
      { code: 'D24', label: 'Psych Scan', desc: 'Bias & groupthink' }
    ]
  },
  {
    id: 'R',
    title: "Risk & Vuln.",
    icon: <AlertTriangle size={14} />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-950/30',
    borderColor: 'border-orange-900/50',
    items: [
      { code: 'R11', label: 'Categorization', desc: 'Strategic vs Ops' },
      { code: 'R21', label: 'Assumptions', desc: 'Hidden beliefs' }
    ]
  },
  {
    id: 'C',
    title: "Counterpoints",
    icon: <MessageSquare size={14} />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/30',
    borderColor: 'border-blue-900/50',
    items: [
      { code: 'C11', label: 'Opposition Map', desc: 'Who opposes?' },
      { code: 'C14', label: 'DA Synthesis', desc: 'Counter-narrative' }
    ]
  },
  {
    id: 'A',
    title: "Alternatives",
    icon: <Compass size={14} />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/30',
    borderColor: 'border-cyan-900/50',
    items: [
      { code: 'A11', label: 'Primary Alts', desc: 'Aggressive/Safe' },
      { code: 'A21', label: 'Contrarian', desc: 'Skeptic/Optimist' }
    ]
  },
  {
    id: 'M',
    title: "Mitigation",
    icon: <Shield size={14} />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/30',
    borderColor: 'border-emerald-900/50',
    items: [
      { code: 'M11', label: 'Prevention', desc: 'Eliminate risks' },
      { code: 'M12', label: 'Contingency', desc: 'Plan B/C' }
    ]
  },
  {
    id: 'P',
    title: "Philosophy",
    icon: <Brain size={14} />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/30',
    borderColor: 'border-purple-900/50',
    items: [
      { code: 'P11', label: 'Hill\'s Purpose', desc: 'Definiteness' },
      { code: 'P21', label: 'Greene\'s Power', desc: 'Power dynamics' }
    ]
  },
  {
    id: 'K',
    title: "Cognitive (K)",
    icon: <Brain size={14} />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-950/30',
    borderColor: 'border-pink-900/50',
    items: [
      { code: 'K11', label: 'System 1/2', desc: 'Thinking mode' },
      { code: 'K21', label: 'Anchoring', desc: 'Initial info bias' }
    ]
  },
  {
    id: 'T',
    title: "Strategy (T)",
    icon: <SwordsIcon size={14} />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/30',
    borderColor: 'border-amber-900/50',
    items: [
      { code: 'T11', label: 'Terrain', desc: 'Landscape' },
      { code: 'T12', label: 'Timing', desc: 'Strategic window' }
    ]
  },
  {
    id: 'V',
    title: "Validation",
    icon: <Shield size={14} />,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-950/30',
    borderColor: 'border-indigo-900/50',
    items: [
      { code: 'V11', label: 'Bias Correction', desc: 'Debiased results' },
      { code: 'V32', label: 'Recommendation', desc: 'Final verdict' }
    ]
  },
  {
    id: 'I',
    title: "Integration",
    icon: <Layers size={14} />,
    color: 'text-teal-400',
    bgColor: 'bg-teal-950/30',
    borderColor: 'border-teal-900/50',
    items: [
      { code: 'I31', label: 'Triangulation', desc: '3-way sync' },
      { code: 'I41', label: 'Final Verdict', desc: 'Go/No-Go' }
    ]
  }
];

const HotkeyReference: React.FC<HotkeyReferenceProps> = ({ activeHotkeys = [], className = "", onClose }) => {
  const [openSection, setOpenSection] = useState<string | null>('D');

  // Automatically open the section if it contains active hotkeys
  useEffect(() => {
    if (activeHotkeys.length > 0) {
      const categoryToOpen = categories.find(cat => 
        cat.items.some(item => activeHotkeys.some(k => k.startsWith(item.code)))
      );
      if (categoryToOpen) {
        setOpenSection(categoryToOpen.id);
      }
    }
  }, [activeHotkeys]);

  const isHotkeyActive = (code: string) => {
    return activeHotkeys.some(k => k.startsWith(code));
  };

  return (
    <div className={`bg-slate-950 border-r border-slate-800 w-full md:w-80 flex-shrink-0 flex flex-col h-full overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-40 ${className}`}>
      
      {/* 🍱 Header Area */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div>
            <h2 className="text-slate-200 font-sans font-bold flex items-center gap-2 tracking-tight">
            <Grid className="w-4 h-4 text-devil-500" />
            <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">FRAMEWORK_MAP</span>
            </h2>
            <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-wider">Dialectical Navigation System</p>
        </div>
        {onClose && (
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors md:hidden">
                <X size={20} />
            </button>
        )}
      </div>

      {/* 🍱 The Bento Grid (Option 1) */}
      <div className="p-2 grid grid-cols-2 gap-2 bg-slate-900/50 border-b border-slate-800 shrink-0">
        {categories.map((cat) => (
           <button
             key={cat.id}
             onClick={() => setOpenSection(cat.id)}
             className={`
               relative flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 group
               ${openSection === cat.id 
                 ? `bg-slate-800 border-slate-600 shadow-lg scale-[1.02]` 
                 : `bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900`
               }
             `}
           >
             <div className={`p-1.5 rounded-md ${cat.bgColor} ${cat.color} border ${cat.borderColor}`}>
               {cat.icon}
             </div>
             <div className="text-left">
               <span className={`block text-[10px] font-black font-mono leading-none mb-0.5 ${cat.color} opacity-80`}>
                 {cat.id}
               </span>
               <span className="block text-[10px] font-medium text-slate-400 leading-none group-hover:text-slate-200 truncate w-16">
                 {cat.title}
               </span>
             </div>
             {/* Active Indicator Dot */}
             {cat.items.some(item => isHotkeyActive(item.code)) && (
               <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
             )}
           </button>
        ))}
      </div>
      
      {/* 📂 Detailed Accordion List (Option 6 & 4) */}
      <div className="overflow-y-auto flex-1 p-2 space-y-1 scrollbar-hide relative">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none z-10" />
        
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-lg overflow-hidden transition-all duration-300">
            <button
              onClick={() => setOpenSection(openSection === cat.id ? null : cat.id)}
              className={`
                w-full flex items-center justify-between p-3 text-left transition-all duration-200
                ${openSection === cat.id ? 'bg-slate-900' : 'hover:bg-slate-900/50 text-slate-500'}
                ${cat.items.some(item => isHotkeyActive(item.code)) ? 'border-l-2 border-emerald-500 bg-slate-900/80' : 'border-l-2 border-transparent'}
              `}
            >
              <span className={`font-semibold text-xs flex items-center gap-2 ${openSection === cat.id ? 'text-slate-200' : ''}`}>
                <span className={`font-mono ${cat.color}`}>{cat.id}</span> 
                {cat.title}
              </span>
              {openSection === cat.id ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-700" />}
            </button>
            
            {openSection === cat.id && (
              <div className="bg-slate-950/30 p-2 space-y-1 border-t border-slate-900 shadow-inner">
                {cat.items.map((item) => {
                  const active = isHotkeyActive(item.code);
                  return (
                    <div 
                      key={item.code} 
                      className={`
                        group flex items-start gap-3 p-2 rounded-md cursor-default transition-all duration-300 relative overflow-hidden
                        ${active ? 'bg-slate-800 border border-slate-700 shadow-md' : 'hover:bg-slate-900 border border-transparent'}
                      `}
                    >
                      {active && <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${cat.color.replace('text', 'bg')}`} />}
                      
                      {/* Option 4: Design Token Styling */}
                      <span className={`
                        font-mono text-[10px] font-bold px-1.5 py-1 rounded border min-w-[32px] text-center mt-0.5
                        ${active 
                          ? `${cat.bgColor} ${cat.color} ${cat.borderColor} shadow-sm` 
                          : 'bg-slate-950 text-slate-500 border-slate-800 group-hover:border-slate-700'
                        }
                      `}>
                        {item.code}
                      </span>
                      
                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-medium truncate ${active ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-600 truncate">{item.desc}</span>
                      </div>
                      
                      {active && <Zap size={10} className={`${cat.color} ml-auto mt-1 animate-pulse`} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        <div className="h-8" /> {/* Spacing for bottom */}
      </div>
    </div>
  );
};

export default HotkeyReference;