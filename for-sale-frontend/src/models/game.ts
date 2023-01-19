export type PlayerData = {
  nickname: string;
  orderNumber: number;
  passed: boolean;
  bid: number;
  lastBidProperty?: number;
  lastBidMoney?: number;
  isCurrentTurn: boolean;
};

export type OpponentData = {
  nickname: string;
} & PlayerData;

export type Hand = {
  coins: number;
  properties: number[];
  money: number[];
  bidProperty?: number;
};

export type Table = {
  properties?: number[];
  money?: number[];
};

export type FinalRating = {
  nickaname: string;
  score: number;
};

export enum GamePhase {
  BID_COINS,
  BID_PROPERTY,
  END,
}
export type CardType = 'property' | 'money';
