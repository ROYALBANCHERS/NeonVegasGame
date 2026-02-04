import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Transaction } from '../types';

interface GameContextType {
  user: User;
  totalBalance: number;
  placeBet: (amount: number) => boolean;
  settleGame: (betAmount: number, multiplier: number) => number; // Returns net win amount
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<string>; // Returns error string or empty if success
  verifyKYC: () => Promise<void>;
  transactions: Transaction[];
  recentWinners: string[];
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: 'user-123',
    username: 'Guest_Player',
    wallet: {
      deposit: 0,
      winnings: 0,
      bonus: 100, // Sign up bonus
    },
    kycVerified: false,
    referralCode: 'NEON2024'
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentWinners, setRecentWinners] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const totalBalance = user.wallet.deposit + user.wallet.winnings + user.wallet.bonus;

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
    
    // Simulate live ticker updates
    const interval = setInterval(() => {
      const names = ['CryptoKing', 'Alice_X', 'VegasPro', 'LudoMaster', 'User78xx', 'LuckyDay'];
      const amounts = [500, 1200, 50, 2000, 350, 800];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      const msg = `${randomName} just won $${randomAmount}`;
      setRecentWinners(prev => [msg, ...prev].slice(0, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const addTransaction = (type: Transaction['type'], amount: number) => {
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      amount,
      timestamp: Date.now(),
      status: 'success'
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const placeBet = (amount: number): boolean => {
    if (totalBalance < amount) return false;

    // Deduction Logic:
    // 1. Use Bonus (up to 10% of bet or available bonus)
    // 2. Use Deposit
    // 3. Use Winnings
    
    let remaining = amount;
    let newWallet = { ...user.wallet };
    
    // 1. Deduct from Bonus (Max 10% usage allowed per bet to prevent abuse)
    const maxBonusUse = amount * 0.10;
    const bonusDeduction = Math.min(newWallet.bonus, maxBonusUse);
    newWallet.bonus -= bonusDeduction;
    remaining -= bonusDeduction;

    // 2. Deduct from Deposit
    if (remaining > 0) {
      const depositDeduction = Math.min(newWallet.deposit, remaining);
      newWallet.deposit -= depositDeduction;
      remaining -= depositDeduction;
    }

    // 3. Deduct from Winnings
    if (remaining > 0) {
      const winningsDeduction = Math.min(newWallet.winnings, remaining);
      newWallet.winnings -= winningsDeduction;
      remaining -= winningsDeduction;
    }

    if (remaining > 0.01) return false; // Should not happen given initial check

    setUser(prev => ({ ...prev, wallet: newWallet }));
    // Note: We don't log "bet" as a transaction to avoid clutter, only fees/wins
    return true;
  };

  const settleGame = (betAmount: number, multiplier: number): number => {
    // Platform Fee: 10% on gross winnings
    const grossWin = betAmount * multiplier;
    if (grossWin === 0) return 0;

    const platformFee = grossWin * 0.10;
    const netWin = grossWin - platformFee;

    setUser(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        winnings: prev.wallet.winnings + netWin
      }
    }));

    addTransaction('game_win', netWin);
    return netWin;
  };

  const deposit = async (amount: number) => {
    // Simulate Razorpay Delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUser(prev => ({
      ...prev,
      wallet: { ...prev.wallet, deposit: prev.wallet.deposit + amount }
    }));
    addTransaction('deposit', amount);
  };

  const withdraw = async (amount: number): Promise<string> => {
    if (!user.kycVerified) return "KYC Verification Required";
    if (amount > user.wallet.winnings) return "Insufficient Winnings Balance";
    if (amount < 10) return "Minimum withdrawal is $10";

    await new Promise(resolve => setTimeout(resolve, 1500));
    setUser(prev => ({
      ...prev,
      wallet: { ...prev.wallet, winnings: prev.wallet.winnings - amount }
    }));
    addTransaction('withdraw', amount);
    return "";
  };

  const verifyKYC = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUser(prev => ({ ...prev, kycVerified: true }));
  };

  return (
    <GameContext.Provider value={{ 
      user, 
      totalBalance, 
      placeBet, 
      settleGame, 
      deposit, 
      withdraw, 
      verifyKYC, 
      transactions,
      recentWinners,
      isLoading 
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
