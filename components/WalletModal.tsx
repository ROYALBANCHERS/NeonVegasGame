import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, History, Landmark, Upload } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { user, totalBalance, deposit, withdraw, verifyKYC, transactions } = useGame();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'kyc' | 'history'>('deposit');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setProcessing(true);
    await deposit(Number(amount));
    setProcessing(false);
    setMsg('Deposit Successful!');
    setTimeout(() => setMsg(''), 2000);
    setAmount('');
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount))) return;
    setProcessing(true);
    const error = await withdraw(Number(amount));
    setProcessing(false);
    if (error) setMsg(error);
    else {
      setMsg('Withdrawal Processed Instantly via RazorpayX');
      setAmount('');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const handleKYC = async () => {
    setProcessing(true);
    await verifyKYC();
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <CreditCard className="text-purple-500" /> Wallet
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
        </div>

        {/* Balance Overview */}
        <div className="p-6 bg-slate-800/50 grid grid-cols-3 gap-2 text-center">
           <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
             <p className="text-[10px] text-slate-400 uppercase">Deposit</p>
             <p className="text-blue-400 font-bold">${user.wallet.deposit.toFixed(2)}</p>
           </div>
           <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
             <p className="text-[10px] text-slate-400 uppercase">Winnings</p>
             <p className="text-emerald-400 font-bold">${user.wallet.winnings.toFixed(2)}</p>
           </div>
           <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
             <p className="text-[10px] text-slate-400 uppercase">Bonus</p>
             <p className="text-purple-400 font-bold">${user.wallet.bonus.toFixed(2)}</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {['deposit', 'withdraw', 'kyc', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setMsg(''); }}
              className={`flex-1 py-3 text-sm font-bold uppercase transition-colors 
                ${activeTab === tab ? 'text-white border-b-2 border-purple-500 bg-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {msg && (
            <div className={`p-3 rounded-lg mb-4 text-center text-sm font-bold ${msg.includes('Success') || msg.includes('Instantly') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {msg}
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">Add cash instantly using UPI or Cards.</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[50, 100, 500].map(val => (
                  <button key={val} onClick={() => setAmount(val.toString())} className="py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600">
                    ${val}
                  </button>
                ))}
              </div>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter Amount" 
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={handleDeposit} 
                disabled={processing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2"
              >
                {processing ? 'Processing...' : <>Pay via Razorpay <CreditCard size={16} /></>}
              </button>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-400">Withdraw winnings to your bank account.</p>
              <div className="p-3 bg-emerald-900/20 border border-emerald-900 rounded-lg flex justify-between items-center">
                <span className="text-sm text-emerald-400">Withdrawable Balance</span>
                <span className="font-bold text-white">${user.wallet.winnings.toFixed(2)}</span>
              </div>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter Amount" 
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={handleWithdraw} 
                disabled={processing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {processing ? 'Processing Payout...' : <>Instant Withdraw <Landmark size={16} /></>}
              </button>
              <p className="text-xs text-slate-500 text-center">Requires verified KYC. Min $10.</p>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="space-y-6 text-center">
              {user.kycVerified ? (
                 <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500">
                       <ShieldCheck className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Account Verified</h3>
                    <p className="text-slate-400 text-sm">You can now withdraw your winnings instantly.</p>
                 </div>
              ) : (
                <>
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center gap-2 hover:border-purple-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <p className="text-sm text-slate-300 font-bold">Upload Aadhaar / PAN</p>
                    <p className="text-xs text-slate-500">Supported: JPG, PNG, PDF</p>
                  </div>
                  <button 
                    onClick={handleKYC}
                    disabled={processing}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg"
                  >
                    {processing ? 'Verifying Documents...' : 'Submit for Verification'}
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2">
              {transactions.length === 0 && <p className="text-center text-slate-500 py-4">No transactions yet.</p>}
              {transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'deposit' ? 'bg-blue-500/20 text-blue-400' : tx.type === 'game_win' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {tx.type === 'deposit' ? <CreditCard size={14} /> : <History size={14} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white capitalize">{tx.type.replace('_', ' ')}</p>
                      <p className="text-[10px] text-slate-500">{new Date(tx.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold ${tx.type === 'game_win' || tx.type === 'deposit' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.type === 'game_win' || tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
