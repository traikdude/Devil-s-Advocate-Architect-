import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Label } from 'recharts';
import { RiskPoint } from '../types';
import { AlertTriangle, Crosshair } from 'lucide-react';

interface RiskChartProps {
  risks: RiskPoint[];
}

const RiskChart: React.FC<RiskChartProps> = ({ risks }) => {
  const getColor = (impact: number, probability: number) => {
    const score = impact * probability;
    if (score >= 60) return '#ef4444'; // Critical (Red)
    if (score >= 30) return '#f97316'; // High (Orange)
    return '#eab308'; // Medium (Yellow)
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-lg shadow-2xl min-w-[200px]">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getColor(data.impact, data.probability) }}></span>
            <p className="text-white font-bold text-xs uppercase tracking-wide">{data.category}</p>
          </div>
          <p className="text-slate-200 font-medium mb-3 text-sm">{data.name}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
             <div className="bg-white/5 p-2 rounded border border-white/5">
                <span className="text-slate-500 block text-[10px] uppercase">Probability</span>
                <span className="text-white font-mono font-bold">{data.probability}/10</span>
             </div>
             <div className="bg-white/5 p-2 rounded border border-white/5">
                <span className="text-slate-500 block text-[10px] uppercase">Impact</span>
                <span className="text-white font-mono font-bold">{data.impact}/10</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative h-[450px] w-full bg-slate-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl overflow-hidden group">
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 p-4 opacity-50">
        <Crosshair className="text-white/20" size={24} />
      </div>

      <div className="relative z-10 flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-widest">
          <AlertTriangle size={14} className="text-devil-400" />
          Risk Landscape Radar
        </h3>
        <div className="flex gap-4 text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-devil-500"></span> CRITICAL</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> HIGH</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> MEDIUM</div>
        </div>
      </div>

      <div className="h-[340px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
              type="number" 
              dataKey="probability" 
              name="Probability" 
              domain={[0, 10]} 
              tickCount={11}
              stroke="#64748b"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              label={{ value: 'PROBABILITY →', position: 'bottom', fill: '#64748b', fontSize: 10, offset: 0 }}
            />
            <YAxis 
              type="number" 
              dataKey="impact" 
              name="Impact" 
              domain={[0, 10]} 
              tickCount={11}
              stroke="#64748b"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
              label={{ value: 'IMPACT ↑', angle: -90, position: 'left', fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#ffffff50' }} />
            
            {/* Quadrant Lines */}
            <ReferenceLine y={5} stroke="#ffffff20" strokeDasharray="3 3" />
            <ReferenceLine x={5} stroke="#ffffff20" strokeDasharray="3 3" />
            
            <Scatter name="Risks" data={risks}>
              {risks.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={getColor(entry.impact, entry.probability)} 
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskChart;