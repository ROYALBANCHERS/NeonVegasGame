import React, { useState } from 'react';
import { GameLayout } from '../components/GameLayout';
import { useGame } from '../context/GameContext';
import { Hand, Scissors, Scroll } from 'lucide-react';
import { getAIStrategyMove } from '../services/geminiService';

const MOVES = [
  { id: 'rock', icon: Hand, beats: 'scissors' },
  { id: 'paper', icon: Scroll, beats: 'rock' },
  { id: 'scissors', icon: Scissors, beats: 'paper' },
];

export const RPS: React.FC = () => {
  const { placeBet, settleGame } = useGame();
  const [playing, setPlaying] = useState(false);
  const [result, setResult] = useState<string>('Choose your weapon');
  const [aiMove, setAiMove] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<{status: 'win'|'loss'|'neutral', amount: number} | undefined>(undefined);
  const bet = 50;

  const play = async (playerMoveId: string) => {
    if (playing) return;
    if (!placeBet(bet)) return alert("Insufficient funds");

    setPlaying(true);
    
    // Use AI service to get a "random" number 1-3 mapped to moves
    const aiSeed = await getAIStrategyMove("Rock Paper Scissors Game State");
    const aiChoiceIdx = aiSeed % 3;
    const aiChoice = MOVES[aiChoiceIdx];

    setAiMove(aiChoice.id);
    
    const playerChoice = MOVES.find(m => m.id === playerMoveId)!;

    if (playerChoice.id === aiChoice.id) {
      setResult("It's a Tie!");
      settleGame(bet, 1); // Refund
      setLastResult({ status: 'neutral', amount: 0 });
    } else if (playerChoice.beats === aiChoice.id) {
      setResult("You Win!");
      const netWin = settleGame(bet, 2);
      setLastResult({ status: 'win', amount: netWin });
    } else {
      setResult("AI Wins!");
      setLastResult({ status: 'loss', amount: bet });
    }
    
    setPlaying(false);
  };

  return (
    <GameLayout title="RPS Arena" gameId="rps" lastResult={lastResult}>
       <div className="flex flex-col items-center gap-10">
          <h2 className="text-2xl font-bold text-slate-300">{result}</h2>
          
          <div className="flex gap-8 items-center">
             <div className="text-center">
               <p className="mb-2 text-sm text-slate-500">OPPONENT</p>
               <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center border-2 border-red-500/50">
                  {aiMove ? (
                     React.createElement(MOVES.find(m => m.id === aiMove)!.icon, { className: 'w-10 h-10 text-red-400' })
                  ) : <span className="text-3xl">?</span>}
               </div>
             </div>
          </div>

          <div className="flex gap-4">
             {MOVES.map(m => (
               <button 
                 key={m.id}
                 onClick={() => play(m.id)}
                 disabled={playing}
                 className="p-6 bg-slate-800 rounded-xl hover:bg-slate-700 border border-slate-600 transition-all hover:-translate-y-1"
               >
                 <m.icon className="w-8 h-8 text-blue-400" />
                 <span className="block text-xs mt-2 uppercase">{m.id}</span>
               </button>
             ))}
          </div>
          <p className="text-sm text-slate-500">Bet: ${bet}</p>
       </div>
    </GameLayout>
  );
};
