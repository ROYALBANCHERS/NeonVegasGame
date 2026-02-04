import React, { useState } from 'react';
import { GameLayout } from '../components/GameLayout';
import { useGame } from '../context/GameContext';

const COLORS = ['green', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black'];

export const Roulette: React.FC = () => {
  const { placeBet, settleGame } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [betColor, setBetColor] = useState<'red' | 'black' | null>(null);
  const [betAmount] = useState(50);
  const [lastResult, setLastResult] = useState<{status: 'win'|'loss'|'neutral', amount: number} | undefined>(undefined);

  const spinWheel = async () => {
    if (!betColor || !placeBet(betAmount)) {
        if (!betColor) return;
        return alert("Insufficient Funds");
    }
    
    setSpinning(true);
    setResult(null);

    // Animation simulation
    await new Promise(r => setTimeout(r, 2000));

    const outcome = Math.floor(Math.random() * 12); // 0-12
    setResult(outcome);
    setSpinning(false);

    const outcomeColor = outcome === 0 ? 'green' : (outcome % 2 === 0 ? 'black' : 'red');

    if (outcomeColor === betColor) {
      const netWin = settleGame(betAmount, 2);
      setLastResult({ status: 'win', amount: netWin });
    } else {
      setLastResult({ status: 'loss', amount: betAmount });
    }
  };

  return (
    <GameLayout title="Mini Roulette" gameId="roulette" lastResult={lastResult}>
       <div className="flex flex-col items-center gap-8 w-full max-w-md">
          {/* Wheel Visual */}
          <div className={`w-64 h-64 rounded-full border-8 border-yellow-600 flex items-center justify-center relative overflow-hidden bg-slate-800 shadow-2xl ${spinning ? 'animate-spin' : ''}`}>
             <div className="absolute inset-0 bg-[conic-gradient(at_center,_#22c55e_0deg_30deg,_#ef4444_30deg_180deg,_#000000_180deg_360deg)] opacity-20" />
             <div className="w-48 h-48 rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-700 z-10">
                {result !== null && !spinning ? (
                  <div className={`text-6xl font-bold ${result === 0 ? 'text-green-500' : (result % 2 === 0 ? 'text-white' : 'text-red-500')}`}>
                    {result}
                  </div>
                ) : (
                  <span className="text-slate-600 font-display text-xl">NEON</span>
                )}
             </div>
             {/* Ball */}
             {spinning && <div className="absolute top-2 w-4 h-4 bg-white rounded-full shadow-lg" />}
          </div>

          <div className="flex gap-4 w-full">
            <button 
              onClick={() => setBetColor('red')}
              className={`flex-1 py-4 rounded-xl font-bold text-white transition-all border-2
                ${betColor === 'red' ? 'bg-red-600 border-yellow-400 scale-105' : 'bg-red-900/50 border-red-900 hover:bg-red-800'}
              `}
            >
              RED
            </button>
            <button 
              onClick={() => setBetColor('black')}
              className={`flex-1 py-4 rounded-xl font-bold text-white transition-all border-2
                ${betColor === 'black' ? 'bg-slate-900 border-yellow-400 scale-105' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}
              `}
            >
              BLACK
            </button>
          </div>

          <button
             onClick={spinWheel}
             disabled={!betColor || spinning}
             className="w-full py-3 bg-yellow-500 text-black font-bold uppercase rounded-lg hover:bg-yellow-400 disabled:opacity-50"
          >
            {spinning ? 'Rolling...' : 'Place Bet ($50)'}
          </button>
       </div>
    </GameLayout>
  );
};
