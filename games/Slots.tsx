import React, { useState } from 'react';
import { GameLayout } from '../components/GameLayout';
import { useGame } from '../context/GameContext';
import { Cherry, DollarSign, Gem, Star, Zap } from 'lucide-react';

const SYMBOLS = [
  { id: 1, icon: Cherry, color: 'text-red-500', val: 2 },
  { id: 2, icon: Zap, color: 'text-yellow-400', val: 5 },
  { id: 3, icon: Star, color: 'text-purple-400', val: 10 },
  { id: 4, icon: Gem, color: 'text-blue-400', val: 20 },
  { id: 5, icon: DollarSign, color: 'text-emerald-500', val: 50 },
];

export const Slots: React.FC = () => {
  const { placeBet, settleGame } = useGame();
  const [reels, setReels] = useState([0, 0, 0]);
  const [spinning, setSpinning] = useState(false);
  const [bet] = useState(20);
  const [lastResult, setLastResult] = useState<{status: 'win'|'loss'|'neutral', amount: number} | undefined>(undefined);

  const spin = async () => {
    if (spinning) return;
    if (!placeBet(bet)) return alert("Insufficient funds");
    
    setSpinning(true);
    setLastResult(undefined);

    // Simulate spin time
    await new Promise(r => setTimeout(r, 1500));

    const newReels = [
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
    ];
    setReels(newReels);
    setSpinning(false);

    // Check Win
    if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
      const multiplier = SYMBOLS[newReels[0]].val;
      const netWin = settleGame(bet, multiplier);
      setLastResult({ status: 'win', amount: netWin });
    } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
      // Small win for 2 matches
      const netWin = settleGame(bet, 1.5);
      setLastResult({ status: 'win', amount: netWin });
    } else {
      setLastResult({ status: 'loss', amount: bet });
    }
  };

  return (
    <GameLayout title="Cyber Slots" gameId="slots" lastResult={lastResult}>
      <div className="flex flex-col items-center gap-10">
        <div className="flex gap-4 p-8 bg-slate-800 rounded-3xl border-4 border-slate-600 shadow-2xl relative">
          {/* Decorative Lights */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75" />
          
          {reels.map((symbolIdx, i) => {
            const SymbolIcon = SYMBOLS[symbolIdx].icon;
            return (
              <div key={i} className="w-24 h-32 md:w-32 md:h-40 bg-slate-900 border-x-4 border-slate-700 overflow-hidden relative flex items-center justify-center">
                 <div className={`transition-transform duration-500 ${spinning ? 'animate-spin-slow blur-sm' : ''}`}>
                    <SymbolIcon className={`w-16 h-16 ${SYMBOLS[symbolIdx].color}`} />
                 </div>
                 {/* Shine effect */}
                 <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none" />
              </div>
            );
          })}
          
          {/* Spin Lever Visual (Static) */}
          <div className="absolute -right-12 top-10 w-4 h-32 bg-slate-500 rounded-full border border-slate-400">
             <div className="w-8 h-8 bg-red-600 rounded-full absolute -top-4 -left-2 shadow-lg" />
          </div>
        </div>

        <button 
          onClick={spin}
          disabled={spinning}
          className={`
            px-16 py-4 rounded-full font-black text-2xl uppercase tracking-widest transition-all
            ${spinning 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg shadow-purple-500/40'}
          `}
        >
          {spinning ? 'Spinning...' : 'SPIN ($20)'}
        </button>
      </div>
    </GameLayout>
  );
};
