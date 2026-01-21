import React from 'react';
import { SynthesisResponse } from '../types';
import { Layers, CheckCircle, AlertOctagon, Flag, Compass, Zap, Target, ArrowRight } from 'lucide-react';

interface SynthesisViewProps {
  data: SynthesisResponse;
}

const SynthesisView: React.FC<SynthesisViewProps> = ({ data }) => {
  const { triangulatedAnalysis, finalRecommendation, implementationPath, matrixPosition } = data;

  const getVerdictGradient = (v: string) => {
    if (v.includes('NO-GO')) return 'from-red-600 to-red-800';
    if (v.includes('CONDITIONAL') || v.includes('MODIFY')) return 'from-amber-500 to-orange-600';
    return 'from-emerald-500 to-teal-600';
  };

  const matrixRows = [
    { thesis: 'Strong', risk: 'Weak risks', validation: 'Validates thesis', verdict: '🚀 PROCEED with confidence' },
    { thesis: 'Strong', risk: 'Strong risks', validation: 'Overrides concerns', verdict: '⚡ PROCEED with enhanced mitigation' },
    { thesis: 'Strong', risk: 'Strong risks', validation: 'Mixed validation', verdict: '🔄 MODIFY approach, then proceed' },
    { thesis: 'Strong', risk: 'Strong risks', validation: 'Validates concerns', verdict: '⏸️ PAUSE for more analysis' },
    { thesis: 'Moderate', risk: 'Strong risks', validation: 'Validates thesis', verdict: '⚡ PROCEED with caution' },
    { thesis: 'Moderate', risk: 'Strong risks', validation: 'Validates concerns', verdict: '🛑 RECONSIDER or abandon' },
    { thesis: 'Weak', risk: 'Strong risks', validation: 'Validates concerns', verdict: '🛑 REJECT proposal' },
  ];

  const activeRowIndex = matrixRows.findIndex(row => 
    row.thesis === matrixPosition.thesisStrength &&
    row.risk === matrixPosition.riskStrength &&
    (row.validation === matrixPosition.validationStrength || 
     (row.validation === 'Overrides most concerns' && matrixPosition.validationStrength === 'Overrides concerns'))
  );

  return (
    <div className="space-y-8 mt-8 pt-8 animate-fade-in-up">
      
      {/* 🚀 Hero Banner: Glassmorphism */}
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r ${getVerdictGradient(finalRecommendation.verdict)} rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-1000`}></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden p-8 text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-slate-400 mb-6">
                <Layers size={12} /> Phase 3: Final Synthesis
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
                {finalRecommendation.verdict}
            </h2>

            <div className="flex justify-center gap-8 text-sm font-medium">
                <div className="flex flex-col items-center">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Confidence</span>
                    <span className="text-white bg-white/10 px-3 py-1 rounded border border-white/5">{finalRecommendation.confidenceLevel}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Timing</span>
                    <span className="text-white bg-white/10 px-3 py-1 rounded border border-white/5">{finalRecommendation.timingGuidance}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 📊 Matrix: Scientific Instrument Look */}
          <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
             <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-purple-400 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                    <Compass size={14} /> Decision Matrix
                </h3>
             </div>
             <div className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-black/20 text-slate-500 border-b border-white/5">
                            <th className="p-3 font-semibold uppercase tracking-wider">Thesis</th>
                            <th className="p-3 font-semibold uppercase tracking-wider">Risk</th>
                            <th className="p-3 font-semibold uppercase tracking-wider">Validation</th>
                            <th className="p-3 font-semibold uppercase tracking-wider">Outcome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {matrixRows.map((row, idx) => {
                            const isActive = idx === activeRowIndex;
                            return (
                                <tr key={idx} className={`transition-colors ${isActive ? 'bg-purple-500/10' : 'hover:bg-white/5'}`}>
                                    <td className={`p-3 font-mono ${isActive ? 'text-white font-bold' : 'text-slate-400'}`}>{row.thesis}</td>
                                    <td className={`p-3 font-mono ${isActive ? 'text-white font-bold' : 'text-slate-400'}`}>{row.risk}</td>
                                    <td className={`p-3 font-mono ${isActive ? 'text-white font-bold' : 'text-slate-400'}`}>{row.validation}</td>
                                    <td className={`p-3 ${isActive ? 'text-purple-300 font-bold' : 'text-slate-500'}`}>
                                        {isActive && <span className="mr-2">👉</span>}
                                        {row.verdict.split(' ').slice(1).join(' ')}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
             </div>
          </div>

          {/* 🎯 Triangulation: HUD Style */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
             <h3 className="text-blue-400 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-4">
                <Target size={14} /> Triangulation
             </h3>
             
             <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Thesis Weight</span>
                    <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-slate-200" style={{width: triangulatedAnalysis.thesisWeight}}></div>
                    </div>
                    <span className="text-white font-mono">{triangulatedAnalysis.thesisWeight}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Antithesis</span>
                    <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-devil-500" style={{width: triangulatedAnalysis.antithesisWeight}}></div>
                    </div>
                    <span className="text-devil-400 font-mono">{triangulatedAnalysis.antithesisWeight}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Synthesis</span>
                    <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{width: triangulatedAnalysis.counterThesisWeight}}></div>
                    </div>
                    <span className="text-emerald-400 font-mono">{triangulatedAnalysis.counterThesisWeight}</span>
                </div>
             </div>

             <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{triangulatedAnalysis.resolvedConflicts}"
                </p>
             </div>
          </div>
      </div>

      {/* 🛣️ Implementation Path: Timeline Style */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden p-8">
        <h3 className="text-emerald-400 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-8">
            <Flag size={14} /> Execution Protocol
        </h3>
        
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            {implementationPath.actions.map((step, idx) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 group-hover:border-emerald-500 transition-all">
                        <span className="text-emerald-500 font-mono font-bold text-xs">{idx + 1}</span>
                    </div>
                    
                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded-xl border border-white/5 shadow-lg group-hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase text-slate-500">{step.timeline}</span>
                            <span className="text-[10px] font-mono text-emerald-400">{step.owner}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 text-sm">{step.action}</h4>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/10">
            <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/10">
                <h4 className="text-xs font-bold text-yellow-500 uppercase mb-3 flex items-center gap-2">
                    <AlertOctagon size={12} /> Pivot Triggers
                </h4>
                <ul className="space-y-2">
                    {implementationPath.pivotTriggers.map((t, i) => (
                        <li key={i} className="text-xs text-slate-400 flex gap-2">
                            <span className="text-yellow-500/50">⚠️</span> {t}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                <h4 className="text-xs font-bold text-emerald-500 uppercase mb-3 flex items-center gap-2">
                    <CheckCircle size={12} /> Success Criteria
                </h4>
                <ul className="space-y-2">
                    {implementationPath.successCriteria.map((c, i) => (
                        <li key={i} className="text-xs text-slate-400 flex gap-2">
                            <span className="text-emerald-500/50">🎯</span> {c}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

    </div>
  );
};

export default SynthesisView;