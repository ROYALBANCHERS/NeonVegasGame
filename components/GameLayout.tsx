import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Cpu, MessageSquare, Wallet } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getDealerCommentary } from '../services/geminiService';

interface GameLayoutProps {
  title: string;
  gameId: string;
  children: React.ReactNode;
  lastResult?: { status: 'win' | 'loss' | 'neutral', amount: number };
}

export const GameLayout: React.FC<GameLayoutProps> = ({ title, gameId, children, lastResult }) => {
  const { totalBalance } = useGame();
  const [opponent, setOpponent] = useState<'player' | 'ai'>('player');
  const [connectionStatus, setConnectionStatus] = useState('Searching for players...');
  const [dealerMessage, setDealerMessage] = useState<string>("Welcome! Place your bets.");

  // Simulate matchmaking logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus("No players found nearby.");
      setTimeout(() => {
        setOpponent('ai');
        setConnectionStatus("Connected to AI Opponent (Gemini v3)");
      }, 1500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // AI Commentary Effect
  useEffect(() => {
    if (lastResult) {
      getDealerCommentary(title, lastResult.status, lastResult.amount).then(setDealerMessage);
    }
  }, [lastResult, title]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 pb-20 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Lobby
          </Link>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                <Wallet className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-400 font-bold font-display text-lg">${totalBalance.toFixed(2)}</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
             <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-1 overflow-hidden relative min-h-[500px] flex flex-col">
                {/* Connection Banner */}
                <div className="absolute top-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-2 flex items-center justify-between z-10 px-4">
                   <h1 className="font-display font-bold text-xl text-white">{title}</h1>
                   <div className="flex items-center gap-2 text-xs">
                      {opponent === 'player' ? (
                        <Users className="w-4 h-4 text-blue-400 animate-pulse" />
                      ) : (
                        <Cpu className="w-4 h-4 text-purple-400" />
                      )}
                      <span className={opponent === 'player' ? 'text-blue-200' : 'text-purple-200'}>
                        {connectionStatus}
                      </span>
                   </div>
                </div>

                {/* Game Canvas */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl mt-10">
                   {children}
                </div>
             </div>
          </div>

          {/* Sidebar / Chat / Stats */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-lg">
               <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Live Dealer</h3>
               <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center">
                     <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 bg-slate-700/50 rounded-r-xl rounded-bl-xl p-3 text-sm text-slate-200 italic relative">
                     <MessageSquare className="w-3 h-3 absolute -top-1 -right-1 text-slate-500" />
                     "{dealerMessage}"
                  </div>
               </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 h-64 overflow-y-auto">
               <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Activity Feed</h3>
               <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>User_99</span>
                    <span className="text-emerald-500">Won $500</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>CryptoKing</span>
                    <span className="text-red-500">Lost $20</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-bold border-l-2 border-purple-500 pl-2">
                    <span>You</span>
                    <span>Playing {title}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Alice_X</span>
                    <span className="text-emerald-500">Won $1200</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
