import React, { useState, useEffect, useRef } from 'react';
import { analyzeDecision, validateAnalysis, performSynthesis, performQuickAnalysis } from './services/geminiService';
import { AnalysisResponse, ValidationResponse, SynthesisResponse, QuickAnalysisResponse, FrameworkMode, Attachment } from './types';
import HotkeyReference from './components/HotkeyReference';
import RiskChart from './components/RiskChart';
import ValidationView from './components/ValidationView';
import SynthesisView from './components/SynthesisView';
import ChatInterface from './components/ChatInterface';
import { Brain, Send, AlertTriangle, Shield, Scale, Zap, Terminal, Swords, Layers, Command, Bolt, Sparkles, X, ChevronRight, Menu, Download, FileText, Image as ImageIcon, Video, Paperclip, Link as LinkIcon, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); 
  const [validating, setValidating] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);
  
  const [mode, setMode] = useState<FrameworkMode>('advocate');
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Multimodal State
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [quickResult, setQuickResult] = useState<QuickAnalysisResponse | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResponse | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  const activeHotkeys = [
    ...(quickResult?.hotkeyPath || []),
    ...(result?.hotkeyPath || []),
  ];

  useEffect(() => {
    if (loading) {
        const interval = setInterval(() => {
            setLoadingStep((prev) => (prev + 1) % 4);
        }, 800);
        return () => clearInterval(interval);
    } else {
        setLoadingStep(0);
    }
  }, [loading]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCmdPalette((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleCommand = (cmd: string) => {
    if (cmd === '/quick') setMode('quick');
    else if (cmd === '/advocate') setMode('advocate');
    else if (cmd === '/validate') setMode('validate');
    else if (cmd === '/synthesize') setMode('synthesize');
    else if (cmd === '/full') setMode('full');
    setShowCmdPalette(false);
  };

  // --- Attachment Handling ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        
        let type: Attachment['type'] = 'file';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          content: base64,
          mimeType: file.type,
          name: file.name
        };
        
        setAttachments(prev => [...prev, newAttachment]);
      };
      
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const newAttachment: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'url',
        content: urlInput,
        name: new URL(urlInput).hostname
    };
    setAttachments(prev => [...prev, newAttachment]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const getAttachmentIcon = (type: string) => {
    switch(type) {
        case 'image': return <ImageIcon size={12} />;
        case 'video': return <Video size={12} />;
        case 'url': return <LinkIcon size={12} />;
        default: return <FileText size={12} />;
    }
  };

  // ---------------------------

  const handleExport = () => {
    if (!result) return;
    
    let content = `# Devil's Advocate Architect Report 👿\n\n`;
    content += `**Date:** ${new Date().toLocaleDateString()}\n`;
    content += `**Confidence:** ${result.confidenceLevel}\n\n`;
    content += `## 1. Executive Summary\n${result.criticalAnalysisSummary}\n\n`;
    content += `## 2. The Devil's Advocate View\n${result.devilsAdvocateView}\n\n`;
    content += `## 3. Top Risks\n`;
    result.riskMatrix.forEach(r => {
        content += `- **${r.name}** (${r.category}): Impact ${r.impact}/10, Prob ${r.probability}/10\n`;
    });
    content += `\n## 4. Mitigation Plan\n${result.riskMitigationPlan}\n\n`;
    content += `## 5. Synthesis\n${result.decisionSynthesis}\n`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Strategy_Report_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const executeAnalysis = async () => {
    if (!input.trim() && attachments.length === 0) return;
    setLoading(true);
    setResult(null);
    setQuickResult(null);
    setValidationResult(null);
    setSynthesisResult(null);
    setError(null);

    try {
      if (mode === 'quick') {
        const data = await performQuickAnalysis(input, attachments);
        setQuickResult(data);
      } else {
        const data = await analyzeDecision(input, attachments);
        setResult(data);
        if (mode === 'full') {
          const valData = await validateAnalysis(input, data);
          setValidationResult(valData);
          const synData = await performSynthesis(input, data, valData);
          setSynthesisResult(synData);
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!result) return;
    setValidating(true);
    try {
      const data = await validateAnalysis(input, result);
      setValidationResult(data);
    } catch (err: any) {
      setError(err.message || "Validation failed.");
    } finally {
      setValidating(false);
    }
  };

  const handleSynthesize = async () => {
    if (!result || !validationResult) return;
    setSynthesizing(true);
    try {
        const data = await performSynthesis(input, result, validationResult);
        setSynthesisResult(data);
    } catch (err: any) {
        setError(err.message || "Synthesis failed.");
    } finally {
        setSynthesizing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0f1117] text-slate-100 font-sans overflow-hidden relative selection:bg-devil-500/30">
      
      {/* 🌌 Ambient Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-devil-900/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-emerald-900/5 rounded-full blur-[96px] pointer-events-none" />

      {/* Desktop Sidebar (Bento Box) */}
      <div className="hidden md:block h-full relative z-20">
        <HotkeyReference activeHotkeys={activeHotkeys} />
      </div>

      {/* Mobile Sidebar (Slide-over) */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
            <div className="relative w-80 h-full animate-in slide-in-from-left-full duration-300">
                <HotkeyReference activeHotkeys={activeHotkeys} className="h-full border-r border-white/10" onClose={() => setShowMobileMenu(false)} />
            </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* 📰 Editorial Header */}
        <header className="bg-slate-950/70 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button onClick={() => setShowMobileMenu(true)} className="md:hidden text-slate-400 hover:text-white">
                <Menu size={24} />
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-devil-600 to-devil-800 rounded-lg flex items-center justify-center shadow-lg shadow-devil-900/50">
              <span className="text-2xl filter drop-shadow-md">👿</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Devil's Advocate <span className="hidden sm:inline-block text-devil-400 font-mono text-xs px-2 py-0.5 rounded-full bg-devil-950/50 border border-devil-800">ARCHITECT v3.0</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Strategic Dialectical Engine</p>
            </div>
          </div>
          
          {/* Framework Mode Pills */}
          <div className="hidden lg:flex bg-black/20 backdrop-blur-sm rounded-full p-1 border border-white/5">
             {(['quick', 'advocate', 'validate', 'synthesize', 'full'] as FrameworkMode[]).map((m) => (
               <button
                 key={m}
                 onClick={() => setMode(m)}
                 className={`px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-full transition-all ${
                   mode === m 
                   ? 'bg-devil-600 text-white shadow-lg shadow-devil-900/20' 
                   : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                 }`}
               >
                 {m}
               </button>
             ))}
          </div>

          {/* Mobile Mode Indicator */}
          <div className="lg:hidden">
            <span className="text-[10px] font-bold uppercase text-devil-400 bg-devil-900/20 px-2 py-1 rounded border border-devil-900/30">
                {mode}
            </span>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <div className="max-w-5xl mx-auto space-y-8 pb-32">
            
            {/* 👨‍💻 VS Code / Terminal Input Area */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-devil-500/50 to-indigo-500/50 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg"></div>
              <div className="relative bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Editor Tab Bar */}
                <div className="bg-[#252526] px-4 py-2 border-b border-black/20 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                      </div>
                      <div className="hidden sm:flex ml-4 px-3 py-1 bg-[#1e1e1e] text-xs text-slate-300 font-mono rounded-t-md items-center gap-2 border-t border-l border-r border-transparent">
                         <Terminal size={12} className="text-blue-400" />
                         <span>proposal.txt</span>
                         <X size={10} className="text-slate-500" />
                      </div>
                   </div>
                   
                   {/* Multimodal Toolbar */}
                   <div className="flex items-center gap-1">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*,video/*,application/pdf,text/plain"
                      />
                      <button onClick={() => fileInputRef.current?.click()} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Attach Media">
                         <Paperclip size={14} />
                      </button>
                      
                      <div className="relative">
                        <button onClick={() => setShowUrlInput(!showUrlInput)} className={`p-1.5 hover:text-white hover:bg-white/10 rounded transition-colors ${showUrlInput ? 'text-white bg-white/10' : 'text-slate-400'}`} title="Add URL">
                            <LinkIcon size={14} />
                        </button>
                        {showUrlInput && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-[#252526] border border-white/10 rounded shadow-xl p-2 flex gap-2 z-30">
                                <input 
                                    autoFocus
                                    type="text" 
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                                    placeholder="https://"
                                    className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-devil-500"
                                />
                                <button onClick={handleAddUrl} className="p-1 bg-devil-600 rounded text-white hover:bg-devil-500">
                                    <Plus size={14} />
                                </button>
                            </div>
                        )}
                      </div>
                   </div>
                </div>
                
                {/* Attachments Rail */}
                {attachments.length > 0 && (
                   <div className="bg-[#1e1e1e] px-4 pt-4 pb-0 flex flex-wrap gap-2">
                      {attachments.map(att => (
                          <div key={att.id} className="flex items-center gap-2 bg-[#2d2d2d] border border-white/10 px-2 py-1.5 rounded text-xs text-slate-300 group">
                             <span className="text-blue-400">{getAttachmentIcon(att.type)}</span>
                             <span className="max-w-[150px] truncate">{att.name}</span>
                             <button onClick={() => removeAttachment(att.id)} className="text-slate-500 hover:text-white">
                                <X size={12} />
                             </button>
                          </div>
                      ))}
                   </div>
                )}

                <div className="p-0 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-white/5 flex flex-col items-center py-4 text-slate-600 text-xs font-mono select-none">
                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                    </div>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="// Enter your strategic proposal here..."
                      className="w-full h-40 bg-[#1e1e1e] pl-16 pr-4 py-4 text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                      style={{ caretColor: '#ef4444' }}
                    />
                    
                    {/* Neural Loading Overlay */}
                    {loading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-devil-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Brain size={24} className="text-devil-400 animate-pulse" />
                                </div>
                            </div>
                            <div className="mt-4 font-mono text-xs text-devil-300 font-bold tracking-widest uppercase animate-pulse">
                                {loadingStep === 0 && "Scanning Risk Landscape..."}
                                {loadingStep === 1 && "Excavating Hidden Assumptions..."}
                                {loadingStep === 2 && "Synthesizing Counter-Arguments..."}
                                {loadingStep === 3 && "Calculating Impact Matrix..."}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="bg-[#252526] p-3 border-t border-black/20 flex justify-end">
                  <button
                    onClick={executeAnalysis}
                    disabled={loading || (!input.trim() && attachments.length === 0)}
                    className={`
                      flex items-center gap-2 px-6 py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all
                      ${loading 
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                        : 'bg-devil-600 hover:bg-devil-500 text-white shadow-lg shadow-devil-900/20'
                      }
                    `}
                  >
                     <Zap size={14} /> EXECUTE PROTOCOL
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur border border-red-500/30 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                <AlertTriangle className="text-red-500" />
                <p>{error}</p>
              </div>
            )}

            {/* 💎 Glassmorphic Results Area */}
            
            {/* Quick Result */}
            {quickResult && (
              <div className="animate-fade-in-up">
                 <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                            <Bolt className="text-yellow-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Quick Assessment</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 relative z-10">
                        <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2 block">Top Risk Identifier</span>
                            <p className="text-slate-100 font-medium leading-relaxed">{quickResult.topRisk}</p>
                        </div>
                        <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-2 block">Primary Alternative</span>
                            <p className="text-slate-100 font-medium leading-relaxed">{quickResult.primaryAlternative}</p>
                        </div>
                    </div>
                    <div className="mt-6 bg-emerald-500/10 p-6 rounded-xl border border-emerald-500/20 relative z-10">
                         <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest mb-2 block">Recommendation</span>
                         <p className="text-emerald-100 font-medium text-lg">{quickResult.recommendation}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* Standard Analysis */}
            {result && !quickResult && (
              <div className="space-y-8 animate-fade-in-up">
                
                {/* HUD Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Confidence', val: result.confidenceLevel, color: result.confidenceLevel === 'High' ? 'text-emerald-400' : 'text-yellow-400' },
                    { label: 'Risks Detected', val: result.riskMatrix.length, color: 'text-devil-400' },
                    { label: 'Analysis Depth', val: 'DEEP SCAN', color: 'text-blue-400' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                      <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1">{stat.label}</span>
                      <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* 📝 Option 7: Editorial Layout for Devil's Advocate View */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-devil-900/10 to-transparent pointer-events-none"></div>
                  
                  <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-devil-500/20 flex items-center justify-center border border-devil-500/30">
                            <Swords size={16} className="text-devil-400" />
                        </div>
                        <h2 className="font-bold text-xl text-white tracking-tight">The Antithesis</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleExport}
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs text-slate-300 font-medium transition-colors"
                        >
                            <Download size={14} /> Export Report
                        </button>
                        <span className="text-[10px] font-mono text-devil-400 border border-devil-900 bg-devil-950/50 px-2 py-1 rounded">D-FRAMEWORK ACTIVE</span>
                    </div>
                  </div>

                  <div className="p-8 md:p-10">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* Rendering HTML safely with custom styling for the bold/italics */}
                        <div 
                            className="font-serif text-slate-200 leading-loose"
                            dangerouslySetInnerHTML={{ 
                                __html: result.devilsAdvocateView
                                    .replace(/\n/g, '<br/>')
                                    .replace(/\*\*\*(.*?)\*\*\*/g, '<span class="text-devil-300 font-bold italic bg-devil-950/30 px-1 rounded">$1</span>')
                                    .replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-bold">$1</span>') 
                            }} 
                        />
                    </div>
                    <div className="mt-8 sm:hidden">
                        <button 
                            onClick={handleExport}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded text-sm text-slate-300 font-medium"
                        >
                            <Download size={16} /> Download Full Report
                        </button>
                    </div>
                  </div>
                </div>

                <RiskChart risks={result.riskMatrix} />

                {/* Glassmorphic Buttons */}
                {!validationResult && mode !== 'full' && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleValidate}
                            disabled={validating}
                            className="relative group px-8 py-4 bg-slate-800/50 hover:bg-slate-800 backdrop-blur border border-white/10 rounded-full text-white font-bold flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                        >
                            {validating ? <Loader2 className="animate-spin" /> : <Shield className="text-indigo-400" />}
                            <span>INITIATE STRATEGIC VALIDATION</span>
                            <ChevronRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                )}

                {validationResult && <ValidationView data={validationResult} />}

                {validationResult && !synthesisResult && mode !== 'full' && (
                    <div className="flex justify-center pt-8">
                        <button
                            onClick={handleSynthesize}
                            disabled={synthesizing}
                            className="relative group px-8 py-4 bg-slate-800/50 hover:bg-slate-800 backdrop-blur border border-white/10 rounded-full text-white font-bold flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        >
                             {synthesizing ? <Loader2 className="animate-spin" /> : <Layers className="text-emerald-400" />}
                             <span>PERFORM FINAL SYNTHESIS</span>
                             <ChevronRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>
                )}

                {synthesisResult && <SynthesisView data={synthesisResult} />}

              </div>
            )}
          </div>
        </main>
        
        <ChatInterface />

        {/* Command Palette - Glass Style */}
        {showCmdPalette && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24" onClick={() => setShowCmdPalette(false)}>
            <div className="bg-[#1e1e1e]/90 backdrop-blur-xl w-full max-w-lg rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100" onClick={e => e.stopPropagation()}>
                <div className="p-3 border-b border-white/10 flex items-center gap-2">
                    <Command className="text-slate-400" size={18} />
                    <span className="text-slate-200 text-sm font-medium">Command Palette</span>
                </div>
                <div className="p-2 space-y-1">
                    {[
                        { cmd: '/quick', label: 'Quick Companion', desc: 'Rapid assessment' },
                        { cmd: '/advocate', label: 'Devil\'s Advocate', desc: 'Detailed analysis' },
                        { cmd: '/validate', label: 'Strategic Validation', desc: 'Bias check' },
                        { cmd: '/synthesize', label: 'Synthesis', desc: 'Final verdict' },
                        { cmd: '/full', label: 'Full Protocol', desc: 'End-to-end' },
                    ].map(item => (
                        <button 
                            key={item.cmd}
                            onClick={() => handleCommand(item.cmd)}
                            className="w-full text-left p-3 rounded-lg hover:bg-white/10 flex items-center justify-between group transition-colors"
                        >
                            <div>
                                <span className="font-mono text-devil-400 font-bold">{item.cmd}</span>
                                <span className="text-slate-300 ml-3">{item.label}</span>
                            </div>
                            <span className="text-xs text-slate-500">{item.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper loader component needed since I removed the explicit import in favor of the existing icon imports
const Loader2 = ({ className }: { className?: string }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`lucide lucide-loader-2 ${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default App;