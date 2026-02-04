import React, { useState, useEffect } from 'react';
import { GameLayout } from '../components/GameLayout';
import { useGame } from '../context/GameContext';

type Card = { suit: string; value: string; weight: number };

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const Blackjack: React.FC = () => {
  const { placeBet, settleGame } = useGame();
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting');
  const [message, setMessage] = useState('');
  const [bet, setBet] = useState(10);
  const [lastResult, setLastResult] = useState<{status: 'win'|'loss'|'neutral', amount: number} | undefined>(undefined);

  const createDeck = () => {
    const newDeck: Card[] = [];
    SUITS.forEach(suit => {
      VALUES.forEach(value => {
        let weight = parseInt(value);
        if (['J', 'Q', 'K'].includes(value)) weight = 10;
        if (value === 'A') weight = 11;
        newDeck.push({ suit, value, weight });
      });
    });
    return newDeck.sort(() => Math.random() - 0.5);
  };

  const calculateScore = (hand: Card[]) => {
    let score = hand.reduce((acc, card) => acc + card.weight, 0);
    let aces = hand.filter(card => card.value === 'A').length;
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    return score;
  };

  const dealGame = () => {
    if (!placeBet(bet)) return alert("Insufficient funds");
    
    const newDeck = createDeck();
    const pHand = [newDeck.pop()!, newDeck.pop()!];
    const dHand = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('playing');
    setMessage('');
    
    if (calculateScore(pHand) === 21) {
       endGame('blackjack', pHand, dHand);
    }
  };

  const hit = () => {
    const newHand = [...playerHand, deck.pop()!];
    setPlayerHand(newHand);
    if (calculateScore(newHand) > 21) {
      endGame('bust', newHand, dealerHand);
    }
  };

  const stand = () => {
    setGameState('dealerTurn');
  };

  useEffect(() => {
    if (gameState === 'dealerTurn') {
      let currentDealerHand = [...dealerHand];
      let currentDeck = [...deck];
      
      const playDealer = async () => {
        while (calculateScore(currentDealerHand) < 17) {
          await new Promise(r => setTimeout(r, 800)); // Delay for dramatic effect
          currentDealerHand.push(currentDeck.pop()!);
          setDealerHand([...currentDealerHand]);
          setDeck(currentDeck);
        }
        endGame('compare', playerHand, currentDealerHand);
      };
      playDealer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const endGame = (reason: string, pHand: Card[], dHand: Card[]) => {
    const pScore = calculateScore(pHand);
    const dScore = calculateScore(dHand);
    let winAmount = 0;
    let status: 'win'|'loss'|'neutral' = 'neutral';
    let multiplier = 0;

    if (reason === 'bust') {
      setMessage("Bust! You lose.");
      status = 'loss';
    } else if (reason === 'blackjack') {
      setMessage("Blackjack! You win 2.5x!");
      multiplier = 2.5;
      status = 'win';
    } else if (dScore > 21) {
      setMessage("Dealer Busts! You Win!");
      multiplier = 2;
      status = 'win';
    } else if (pScore > dScore) {
      setMessage("You Win!");
      multiplier = 2;
      status = 'win';
    } else if (dScore > pScore) {
      setMessage("Dealer Wins.");
      status = 'loss';
    } else {
      setMessage("Push.");
      multiplier = 1; // Return bet
      status = 'neutral';
    }

    if (multiplier > 0) {
        winAmount = settleGame(bet, multiplier);
    }
    
    setGameState('gameOver');
    setLastResult({ status, amount: winAmount > 0 ? winAmount - bet : bet }); 
  };

  const CardView: React.FC<{ card: Card; hidden?: boolean }> = ({ card, hidden }) => (
    <div className={`
      w-20 h-28 md:w-24 md:h-36 rounded-xl border-2 shadow-xl flex flex-col items-center justify-center text-2xl font-bold select-none transition-all transform hover:-translate-y-2
      ${hidden 
        ? 'bg-slate-800 border-slate-600 bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]' 
        : 'bg-white border-slate-300 text-slate-900'}
    `}>
      {!hidden && (
        <>
          <span className={['♥', '♦'].includes(card.suit) ? 'text-red-600' : 'text-slate-900'}>{card.value}</span>
          <span className={['♥', '♦'].includes(card.suit) ? 'text-red-600 text-4xl' : 'text-slate-900 text-4xl'}>{card.suit}</span>
        </>
      )}
    </div>
  );

  return (
    <GameLayout title="Royal Blackjack" gameId="blackjack" lastResult={lastResult}>
      <div className="flex flex-col items-center justify-between h-full w-full max-w-3xl py-4">
        
        {/* Dealer Area */}
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-2">
            {dealerHand.map((card, i) => (
              <CardView key={i} card={card} hidden={gameState === 'playing' && i === 0} />
            ))}
          </div>
          <p className="text-slate-400 font-display uppercase tracking-widest text-sm">Dealer</p>
        </div>

        {/* Message Area */}
        <div className="h-16 flex items-center justify-center">
          {message && <div className="text-2xl font-bold text-yellow-400 animate-bounce-short">{message}</div>}
        </div>

        {/* Player Area */}
        <div className="flex flex-col items-center mb-8">
           <p className="text-slate-400 font-display uppercase tracking-widest text-sm mb-2">You ({gameState !== 'betting' ? calculateScore(playerHand) : 0})</p>
           <div className="flex gap-4">
            {playerHand.map((card, i) => (
              <CardView key={i} card={card} />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full flex justify-center gap-4">
          {gameState === 'betting' || gameState === 'gameOver' ? (
             <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 bg-slate-800 p-2 rounded-full">
                  <button onClick={() => setBet(Math.max(10, bet - 10))} className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600">-</button>
                  <span className="font-bold w-12 text-center">${bet}</span>
                  <button onClick={() => setBet(bet + 10)} className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600">+</button>
                </div>
                <button onClick={dealGame} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-12 rounded-full shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-105">
                  DEAL
                </button>
             </div>
          ) : (
            <>
              <button 
                onClick={hit} 
                disabled={gameState !== 'playing'}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full disabled:opacity-50"
              >
                HIT
              </button>
              <button 
                onClick={stand} 
                disabled={gameState !== 'playing'}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-8 rounded-full disabled:opacity-50"
              >
                STAND
              </button>
            </>
          )}
        </div>
      </div>
    </GameLayout>
  );
};
