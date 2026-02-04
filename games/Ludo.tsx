import React, { useState } from 'react';
import { GameLayout } from '../components/GameLayout';
import { useGame } from '../context/GameContext';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy } from 'lucide-react';

const TRACK_LENGTH = 15;

export const LudoGame: React.FC = () => {
  const { placeBet, settleGame } = useGame();
  const [playerPos, setPlayerPos] = useState(0);
  const [aiPos, setAiPos] = useState(0);
  const [turn, setTurn] = useState<'player' | 'ai'>('player');
  const [diceVal, setDiceVal] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'start'>('start');
  const [bet] = useState(50); 
  const [lastResult, setLastResult] = useState<{status: 'win'|'loss'|'neutral', amount: number} | undefined>(undefined);

  const startGame = () => {
    if (placeBet(bet)) {
      setGameStatus('playing');
      setPlayerPos(0);
      setAiPos(0);
      setTurn('player');
      setLastResult(undefined);
    } else {
      alert("Insufficient funds! Please add money to your wallet.");
    }
  };

  const rollDice = async () => {
    if (turn !== 'player' || gameStatus !== 'playing' || rolling) return;

    setRolling(true);
    await new Promise(r => setTimeout(r, 600));
    
    const roll = Math.ceil(Math.random() * 6);
    setDiceVal(roll);
    setRolling(false);

    let newPos = playerPos + roll;
    if (newPos > TRACK_LENGTH) newPos = TRACK_LENGTH;
    setPlayerPos(newPos);

    if (newPos === TRACK_LENGTH) {
      handleWin();
    } else {
      setTurn('ai');
      setTimeout(aiTurn, 1000);
    }
  };

  const aiTurn = async () => {
    setRolling(true);
    await new Promise(r => setTimeout(r, 600));
    const roll = Math.ceil(Math.random() * 6);
    setDiceVal(roll);
    setRolling(false);

    let newPos = aiPos + roll;
    if (newPos > TRACK_LENGTH) newPos = TRACK_LENGTH;
    setAiPos(newPos);

    if (newPos === TRACK_LENGTH) {
      handleLoss();
    } else {
      setTurn('player');
    }
  };

  const handleWin = () => {
    setGameStatus('won');
    // Win logic: Bet amount + Profit (Bet) - Fee handled in settleGame
    // settleGame(bet, 2) -> Total 100, Fee 10, Net Win +90.
    const netWin = settleGame(bet, 2);
    setLastResult({ status: 'win', amount: netWin });
  };

  const handleLoss = () => {
    setGameStatus('lost');
    setLastResult({ status: 'loss', amount: bet });
  };

  const renderDice = (val: number) => {
    const props = { className: `w-16 h-16 ${rolling ? 'animate-spin' : ''} text-white` };
    switch(val) {
      case 1: return <Dice1 {...props} />;
      case 2: return <Dice2 {...props} />;
      case 3: return <Dice3 {...props} />;
      case 4: return <Dice4 {...props} />;
      case 5: return <Dice5 {...props} />;
      default: return <Dice6 {...props} />;
    }
  };

  return (
    <GameLayout title="Neon Ludo Rush" gameId="ludo" lastResult={lastResult}>
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="text-slate-400">Race to the finish line! First to step {TRACK_LENGTH} wins.</p>
          <p className="font-bold text-emerald-400 mt-2">Pot: ${bet * 2} <span className="text-xs text-slate-500">(Platform Fee: 10%)</span></p>
        </div>

        {/* Track */}
        <div className="relative mb-12 space-y-4">
          {/* Player Track */}
          <div className="flex items-center gap-1 bg-slate-800 p-2 rounded-lg relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 bg-blue-500/10 z-0" style={{ width: `${(playerPos/TRACK_LENGTH)*100}%`, transition: 'width 0.5s' }} />
             <span className="z-10 w-8 text-xs font-bold text-blue-400">YOU</span>
             {Array.from({ length: TRACK_LENGTH + 1 }).map((_, i) => (
               <div key={`p-${i}`} className={`flex-1 h-8 rounded-sm flex items-center justify-center text-[10px] relative z-10 
                  ${i === 0 ? 'bg-slate-700' : i === TRACK_LENGTH ? 'bg-yellow-600' : 'bg-slate-700/50 border-r border-slate-900'}
               `}>
                 {playerPos === i && <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 transition-all duration-500" />}
                 {i === TRACK_LENGTH && <Trophy className="w-3 h-3 text-yellow-200 absolute opacity-50" />}
               </div>
             ))}
          </div>

          {/* AI Track */}
          <div className="flex items-center gap-1 bg-slate-800 p-2 rounded-lg relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 bg-red-500/10 z-0" style={{ width: `${(aiPos/TRACK_LENGTH)*100}%`, transition: 'width 0.5s' }} />
            <span className="z-10 w-8 text-xs font-bold text-red-400">AI</span>
             {Array.from({ length: TRACK_LENGTH + 1 }).map((_, i) => (
               <div key={`a-${i}`} className={`flex-1 h-8 rounded-sm flex items-center justify-center text-[10px] relative z-10
                  ${i === 0 ? 'bg-slate-700' : i === TRACK_LENGTH ? 'bg-yellow-600' : 'bg-slate-700/50 border-r border-slate-900'}
               `}>
                 {aiPos === i && <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50 transition-all duration-500" />}
               </div>
             ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
           <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
             {renderDice(diceVal)}
           </div>

           {gameStatus === 'playing' ? (
             <button 
               onClick={rollDice}
               disabled={turn === 'ai' || rolling}
               className={`px-8 py-3 rounded-full font-bold text-lg transition-all
                 ${turn === 'player' && !rolling 
                   ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transform hover:scale-105' 
                   : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
               `}
             >
               {turn === 'player' ? (rolling ? 'Rolling...' : 'ROLL DICE') : 'AI Rolling...'}
             </button>
           ) : gameStatus === 'start' ? (
              <button 
                onClick={startGame}
                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/30"
              >
                Start Game ($50 Entry)
              </button>
           ) : (
             <div className="text-center animate-bounce-short">
                <h2 className={`text-3xl font-display font-bold mb-4 ${gameStatus === 'won' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {gameStatus === 'won' ? 'YOU WON!' : 'AI WINS!'}
                </h2>
                <button 
                  onClick={startGame}
                  className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors"
                >
                  Play Again ($50)
                </button>
             </div>
           )}
        </div>
      </div>
    </GameLayout>
  );
};
