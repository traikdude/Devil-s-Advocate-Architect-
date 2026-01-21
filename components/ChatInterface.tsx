import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Loader2, Sparkles, Bot } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatInterface: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(history, userMessage);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. 🛑" }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-devil-600 to-devil-800 hover:from-devil-500 hover:to-devil-700 text-white rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-3 z-50 group border border-white/10"
      >
        <MessageSquare size={24} className="group-hover:animate-pulse" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[90vw] max-w-md h-[600px] max-h-[80vh] bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col z-50 overflow-hidden animate-fade-in-up ring-1 ring-white/5">
      
      {/* 🌌 Glass Header */}
      <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-devil-600 to-devil-900 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                <Bot size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-wide">Strategic Ally</h3>
            <p className="text-[10px] text-devil-300 font-mono uppercase tracking-wider flex items-center gap-1">
               <Sparkles size={8} /> Online
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                <MessageSquare size={24} className="text-slate-400" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-300">Strategy Awaits</p>
                <p className="text-xs text-slate-500 mt-1">Ask me to challenge your assumptions...</p>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div 
              className={`
                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative group
                ${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-devil-600 to-devil-700 text-white rounded-tr-sm' 
                  : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-sm backdrop-blur-sm'
                }
              `}
            >
              {msg.text}
              {msg.role === 'model' && (
                  <div className="absolute -bottom-4 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 font-mono mt-1 pl-1">
                      AI Generated
                  </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-devil-400" />
              <span className="text-xs text-slate-400 font-mono">Synthesizing counter-arguments...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/5 backdrop-blur-md">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your strategic query..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-devil-500/50 focus:ring-1 focus:ring-devil-500/20 transition-all font-medium"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-1.5 bg-devil-600 hover:bg-devil-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-[10px] text-center text-slate-600 mt-2 font-mono">
            Press Enter to send • 👿 Devil's Advocate Mode
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;