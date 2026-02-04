export interface User {
  id: string;
  username: string;
  wallet: {
    deposit: number;
    winnings: number;
    bonus: number;
  };
  kycVerified: boolean;
  referralCode: string;
}

export enum GameType {
  BLACKJACK = 'blackjack',
  SLOTS = 'slots',
  ROULETTE = 'roulette',
  LUDO = 'ludo',
  CRASH = 'crash',
  RPS = 'rps'
}

export interface GameConfig {
  id: GameType;
  name: string;
  description: string;
  image: string;
  minBet: number;
}

export interface ChatMessage {
  sender: 'player' | 'ai' | 'system';
  text: string;
  timestamp: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'game_fee' | 'game_win' | 'referral';
  amount: number;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}
