import React from 'react';
import { X, Users, Copy, Gift } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose }) => {
  const { user } = useGame();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-600 to-blue-600 opacity-20" />
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"><X /></button>

        <div className="p-6 relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-display font-bold text-white mb-2">Refer & Earn</h2>
          <p className="text-slate-400 text-sm mb-6">Invite friends and get <span className="text-white font-bold">10%</span> of their first deposit as Bonus Cash!</p>

          <div className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Your Referral Code</p>
            <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-slate-600 border-dashed">
              <span className="font-mono text-xl text-yellow-400 font-bold tracking-widest">{user.referralCode}</span>
              <button className="text-slate-400 hover:text-white"><Copy size={18} /></button>
            </div>
          </div>

          <div className="w-full space-y-3">
             <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                   <Users className="text-blue-400" size={20} />
                   <div className="text-left">
                      <p className="text-white font-bold text-sm">Total Referrals</p>
                      <p className="text-xs text-slate-500">Friends joined</p>
                   </div>
                </div>
                <span className="text-xl font-bold text-white">0</span>
             </div>
             
             <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                   <Gift className="text-purple-400" size={20} />
                   <div className="text-left">
                      <p className="text-white font-bold text-sm">Total Earnings</p>
                      <p className="text-xs text-slate-500">Bonus received</p>
                   </div>
                </div>
                <span className="text-xl font-bold text-purple-400">$0.00</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
