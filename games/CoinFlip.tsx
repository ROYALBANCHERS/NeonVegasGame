import React, { useState } from 'react';
import { GameLayout } from '../components/GameLayout';
import { useGame } from '../context/GameContext';

export const CoinFlip: React.FC = () => {
  const { placeBet, settleGame } = useGame();
  const [flipping, setFlipping] = useState(false);
  const [side, setSide] = useState<'heads' | 'tails'>('heads');
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [lastResult, setLastResult] = useState<{status: 'win'|'loss'|'neutral', amount: number} | undefined>(undefined);
  const bet = 100;

  const flip = async () => {
    if (!placeBet(bet)) return alert("Insufficient funds!");
    
    setFlipping(true);
    setResult(null);
    
    await new Promise(r => setTimeout(r, 1000));
    
    const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
    setResult(outcome);
    setFlipping(false);

    if (outcome === side) {
      const netWin = settleGame(bet, 2);
      setLastResult({ status: 'win', amount: netWin });
    } else {
      setLastResult({ status: 'loss', amount: bet });
    }
  };

  return (
    <GameLayout title="Quantum Coin" gameId="coinflip" lastResult={lastResult}>
      <div className="flex flex-col items-center gap-12">
        <div className={`w-40 h-40 rounded-full border-4 flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-900 shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-all duration-700 ${flipping ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
           {result ? result.toUpperCase() : '?'}
        </div>

        <div className="flex gap-4">
           <button onClick={() => setSide('heads')} className={`px-6 py-2 rounded-lg border ${side === 'heads' ? 'bg-yellow-500 text-black border-yellow-500' : 'border-slate-600 text-slate-400'}`}>HEADS</button>
           <button onClick={() => setSide('tails')} className={`px-6 py-2 rounded-lg border ${side === 'tails' ? 'bg-yellow-500 text-black border-yellow-500' : 'border-slate-600 text-slate-400'}`}>TAILS</button>
        </div>

        <button onClick={flip} disabled={flipping} className="px-12 py-3 bg-indigo-600 rounded-full font-bold hover:bg-indigo-500 disabled:opacity-50">
           FLIP COIN ($100)
        </button>
      </div>
    </GameLayout>
  );
};
