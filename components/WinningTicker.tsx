import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy } from 'lucide-react';

export const WinningTicker: React.FC = () => {
  const { recentWinners } = useGame();

  return (
    <div className="bg-slate-900 border-b border-slate-800 h-8 overflow-hidden relative flex items-center">
      <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-slate-900 to-transparent w-10 z-10" />
      <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-slate-900 to-transparent w-10 z-10" />
      
      <div className="flex gap-12 animate-[scroll_20s_linear_infinite] whitespace-nowrap pl-full">
        {recentWinners.map((win, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-display tracking-wider">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-slate-300">
              {win.split(' just won ')[0]} 
              <span className="text-emerald-400 font-bold ml-1">
                 just won {win.split(' just won ')[1]}
              </span>
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
         {recentWinners.map((win, i) => (
          <div key={`d-${i}`} className="flex items-center gap-2 text-xs font-display tracking-wider">
            <Trophy className="w-3 h-3 text-yellow-400" />
            <span className="text-slate-300">
              {win.split(' just won ')[0]} 
              <span className="text-emerald-400 font-bold ml-1">
                 just won {win.split(' just won ')[1]}
              </span>
            </span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};
