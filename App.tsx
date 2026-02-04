import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { GameType } from './types';
import { Blackjack } from './games/Blackjack';
import { Slots } from './games/Slots';
import { LudoGame } from './games/Ludo';
import { Roulette } from './games/Roulette';
import { CoinFlip } from './games/CoinFlip';
import { RPS } from './games/RPS';
import { WinningTicker } from './components/WinningTicker';
import { WalletModal } from './components/WalletModal';
import { ReferralModal } from './components/ReferralModal';
import { AdSenseBanner } from './components/AdSenseBanner';
import { PrivacyPolicy, TermsOfService, AboutUs, BlogPost1 } from './pages/ContentPages';
import { Dices, Wallet, User as UserIcon, PlusCircle, BookOpen, ChevronRight, Shield, Globe, Cpu } from 'lucide-react';

// --- Home Component (Hybrid Layout) ---
const Home = ({ onOpenWallet, onOpenReferral }: { onOpenWallet: () => void, onOpenReferral: () => void }) => {
  const { totalBalance, user } = useGame();

  const games = [
    { id: GameType.BLACKJACK, name: 'Royal Blackjack', img: 'from-purple-600 to-indigo-600', icon: '♠️' },
    { id: GameType.SLOTS, name: 'Cyber Slots', img: 'from-pink-500 to-rose-500', icon: '🎰' },
    { id: GameType.LUDO, name: 'Ludo Rush', img: 'from-blue-500 to-cyan-500', icon: '🎲' },
    { id: GameType.ROULETTE, name: 'Mini Roulette', img: 'from-green-500 to-emerald-600', icon: '🎡' },
    { id: GameType.CRASH, name: 'Coin Flip', link: '/coinflip', img: 'from-yellow-500 to-amber-600', icon: '🪙' },
    { id: GameType.RPS, name: 'RPS Arena', img: 'from-slate-600 to-slate-800', icon: '✂️' },
  ];

  const articles = [
    { title: "The Mathematics of Skill-based Gaming", desc: "Understanding variance and probability in competitive play.", link: "/blog/math-of-gaming" },
    { title: "How to Manage Your Bankroll", desc: "Essential tips to keep your wallet healthy while playing online.", link: "/blog/math-of-gaming" }, // linking same for demo
    { title: "Evolution of Digital Gaming 2026", desc: "What the future holds for AI and blockchain casinos.", link: "/blog/math-of-gaming" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      <WinningTicker />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 pt-8 pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                NEON VEGAS
              </h1>
              <p className="text-slate-400">The Future of AI Gambling & Strategy</p>
           </div>
           
           {/* Wallet Widget */}
           <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-1.5 rounded-2xl flex items-center gap-3 pr-4 shadow-lg cursor-pointer hover:border-slate-500 transition-colors" onClick={onOpenWallet}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div className="text-right mr-2">
                 <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Balance</p>
                 <p className="text-white font-bold font-display text-xl">${totalBalance.toFixed(2)}</p>
              </div>
              <button className="bg-purple-600 p-2 rounded-full hover:bg-purple-500 transition-colors">
                 <PlusCircle size={20} className="text-white" />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Game Grid */}
        <div className="flex items-center justify-between mb-6 mt-4">
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Dices className="text-purple-500" /> Skill Games
           </h2>
           <button onClick={onOpenReferral} className="text-sm text-yellow-400 hover:text-yellow-300 font-bold underline decoration-dashed underline-offset-4">
              Refer & Earn
           </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {games.map((g) => (
            <Link to={g.link || `/${g.id}`} key={g.name} className="group relative overflow-hidden rounded-2xl aspect-video bg-slate-800 border border-slate-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
               <div className={`absolute inset-0 bg-gradient-to-br ${g.img} opacity-80 group-hover:opacity-100 transition-opacity`} />
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">{g.icon}</span>
                  <h3 className="text-2xl font-display font-bold text-white drop-shadow-md">{g.name}</h3>
                  <span className="mt-2 px-3 py-1 bg-black/30 rounded-full text-xs text-white/80 backdrop-blur-sm">Play Now</span>
               </div>
            </Link>
          ))}
        </div>

        {/* AdSense Banner (Safe Zone) */}
        <AdSenseBanner slot="1234567890" />

        {/* Content Section (Blog) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 mb-12">
          <div className="lg:col-span-2">
             <div className="flex items-center gap-2 mb-6">
                <BookOpen className="text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Gaming Insights</h2>
             </div>
             
             <div className="space-y-4">
                {articles.map((article, i) => (
                   <Link to={article.link} key={i} className="block bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors group">
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 mb-2">{article.title}</h3>
                      <p className="text-slate-400 text-sm mb-4">{article.desc}</p>
                      <div className="flex items-center text-xs font-bold text-blue-500 uppercase tracking-wider">
                         Read Article <ChevronRight size={14} />
                      </div>
                   </Link>
                ))}
             </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 sticky top-4">
                <h3 className="text-lg font-bold text-white mb-4">Why NeonVegas?</h3>
                <ul className="space-y-4 text-sm text-slate-300">
                   <li className="flex gap-2"><Shield className="text-emerald-400 w-5 h-5" /> 100% Secure & Verified</li>
                   <li className="flex gap-2"><Cpu className="text-purple-400 w-5 h-5" /> AI Fraud Detection</li>
                   <li className="flex gap-2"><Globe className="text-blue-400 w-5 h-5" /> Global Skill Matching</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-slate-700">
                   <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Advertisement</h4>
                   <div className="bg-slate-700 h-40 w-full flex items-center justify-center text-xs text-slate-500">
                      <AdSenseBanner slot="sidebar-ad" format="rectangle" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 mt-12 px-4">
         <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
               <h4 className="text-white font-bold mb-4 font-display text-lg">NeonVegas</h4>
               <p className="text-slate-500 text-xs leading-relaxed">The premier destination for skill-based gaming. Compete fairly, play responsibly.</p>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Platform</h4>
               <ul className="space-y-2 text-xs text-slate-400">
                  <li><Link to="/" className="hover:text-white">Games</Link></li>
                  <li><Link to="/blog/math-of-gaming" className="hover:text-white">Strategy Blog</Link></li>
                  <li><Link to="/about" className="hover:text-white">About Us</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Legal</h4>
               <ul className="space-y-2 text-xs text-slate-400">
                  <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="text-white font-bold mb-4">Security</h4>
               <div className="flex gap-2 text-slate-500">
                  <Shield size={24} />
                  <span className="text-xs">SSL Encrypted<br/>Fraud Protection</span>
               </div>
            </div>
         </div>
         <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-900 text-center text-xs text-slate-600">
            &copy; 2024 NeonVegas. All rights reserved. 18+ Only. Play Responsibly.
         </div>
      </footer>

      {/* Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-lg border border-slate-700 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl z-40">
         <button className="flex flex-col items-center gap-1 text-purple-400">
            <Dices className="w-5 h-5" />
            <span className="text-[10px] font-bold">Games</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors" onClick={onOpenWallet}>
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] font-bold">Wallet</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors" onClick={onOpenReferral}>
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Profile</span>
         </button>
      </div>
    </div>
  );
};

// --- App Layout Wrapper ---
const AppLayout = () => {
  const [walletOpen, setWalletOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onOpenWallet={() => setWalletOpen(true)} onOpenReferral={() => setReferralOpen(true)} />} />
        
        {/* Game Routes */}
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/slots" element={<Slots />} />
        <Route path="/ludo" element={<LudoGame />} />
        <Route path="/roulette" element={<Roulette />} />
        <Route path="/coinflip" element={<CoinFlip />} />
        <Route path="/rps" element={<RPS />} />

        {/* Content Routes (AdSense Friendly) */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blog/math-of-gaming" element={<BlogPost1 />} />
      </Routes>
      
      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} />
      <ReferralModal isOpen={referralOpen} onClose={() => setReferralOpen(false)} />
    </>
  );
}

// --- Main App ---
const App: React.FC = () => {
  return (
    <GameProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </GameProvider>
  );
};

export default App;