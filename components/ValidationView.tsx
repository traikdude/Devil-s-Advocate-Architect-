import React from 'react';
import { ValidationResponse } from '../types';
import { Brain, Swords, CheckCircle2, XCircle, Scale, AlertOctagon, Info } from 'lucide-react';

interface ValidationViewProps {
  data: ValidationResponse;
}

const ValidationView: React.FC<ValidationViewProps> = ({ data }) => {
  const { cognitiveBiasAudit, strategicValidation, validationSynthesis } = data;

  return (
    <div className="space-y-6 mt-8 pt-8 animate-fade-in-up">
      {/* 🔮 Option 2: Glass Container */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Editorial Header */}
        <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Swords size={24} className="text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Strategic Validation
                    </h2>
                    <p className="text-xs text-indigo-300 font-mono tracking-wider uppercase">Phase 2: Counter-Thesis Analysis</p>
                </div>
            </div>
            <div className="flex items-center gap-2 bg-black/20 p-1.5 pr-4 rounded-full border border-white/5">
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                     validationSynthesis.confidence === 'High' ? 'bg-emerald-500' :
                     validationSynthesis.confidence === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                }`}></span>
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                    {validationSynthesis.confidence} Confidence
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-white/10">
            {/* Left: Cognitive Audit */}
            <div className="p-8 space-y-6">
                <h3 className="text-indigo-400 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-4">
                    <Brain size={14} /> Cognitive Audit
                </h3>
                
                <div className="space-y-3">
                    {cognitiveBiasAudit.biasesDetected.map((bias, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border transition-all ${
                            bias.present 
                            ? 'bg-red-500/10 border-red-500/20 text-red-200' 
                            : 'bg-emerald-500/5 border-emerald-500/10 text-slate-400 opacity-60'
                        }`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-sm tracking-tight">{bias.name}</span>
                                {bias.present && <span className="text-[10px] font-bold bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded text-red-300">DETECTED</span>}
                            </div>
                            <p className="text-xs leading-relaxed">{bias.details}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 p-5 rounded-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-2">Debiased Assessment</span>
                    <p className="text-sm text-slate-200 leading-relaxed font-serif italic border-l-2 border-indigo-500/50 pl-4">
                        "{cognitiveBiasAudit.debiasedRiskAssessment}"
                    </p>
                </div>
            </div>

            {/* Right: Strategic Validation */}
            <div className="p-8 space-y-6 bg-white/[0.02]">
                <h3 className="text-amber-400 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-4">
                    <Swords size={14} /> Strategic Terrain
                </h3>

                <div className="grid grid-cols-2 gap-3 text-center">
                    {[
                        { label: 'Terrain', val: strategicValidation.terrainAssessment, icon: '🏔️' },
                        { label: 'Timing', val: strategicValidation.timingAssessment, icon: '⏱️' },
                        { label: 'Forces', val: strategicValidation.forceAssessment, icon: '💪' },
                        { label: 'Conditions', val: strategicValidation.conditionsAssessment, icon: '⛈️' }
                    ].map((item, i) => (
                        <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-slate-500 text-[10px] uppercase block mb-1">{item.label}</span>
                            <div className="font-bold text-slate-200 text-sm flex items-center justify-center gap-2">
                                <span>{item.icon}</span> {item.val}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 pt-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Strategic Imperatives</div>
                    <ul className="space-y-2">
                        {strategicValidation.strategicImperatives.map((imp, i) => (
                            <li key={i} className="text-sm text-amber-100/90 flex items-start gap-3 bg-amber-900/10 p-2 rounded border border-amber-900/20">
                                <span className="text-amber-500 font-mono text-xs mt-0.5">0{i+1}</span>
                                {imp}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5 space-y-3">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Info size={12} /> Cost of Inaction
                    </div>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-2">
                            <span>Opportunity</span> 
                            <span className="text-slate-200 font-medium text-right max-w-[60%]">{strategicValidation.inactionCosts.opportunityCost}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 pt-1">
                            <span>Competitive</span> 
                            <span className="text-slate-200 font-medium text-right max-w-[60%]">{strategicValidation.inactionCosts.competitiveCost}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Synthesis Footer */}
        <div className="bg-slate-950/40 p-8 border-t border-white/10">
            <h3 className="text-purple-400 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em] mb-6">
                <Scale size={14} /> Validation Verdict
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-xs font-bold text-emerald-500 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <CheckCircle2 size={14}/> Validated Concerns
                    </h4>
                    <ul className="space-y-2">
                        {validationSynthesis.legitimateConcerns.map((c, i) => (
                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                                {c}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-xs font-bold text-red-500 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <XCircle size={14}/> Biased / Invalid Concerns
                    </h4>
                    <ul className="space-y-2">
                        {validationSynthesis.concernsOverridden.map((c, i) => (
                            <li key={i} className="text-sm text-slate-400 flex items-start gap-2 opacity-80">
                                <span className="w-1 h-1 bg-red-500 rounded-full mt-2 shrink-0"></span>
                                <span className="line-through decoration-red-500/50">{c}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-1 rounded-xl">
                <div className="bg-slate-900/80 backdrop-blur p-5 rounded-lg border border-purple-500/20 flex items-start gap-4">
                    <div className="bg-purple-500/20 p-2 rounded-full shrink-0">
                        <AlertOctagon className="text-purple-400" size={20} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest block mb-1">Counter-Recommendation</span>
                        <p className="text-white font-medium text-lg leading-relaxed">
                            {validationSynthesis.counterRecommendation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationView;