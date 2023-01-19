import { requests } from '..';
import {
  FinalRating,
  GamePhase,
  Hand,
  OpponentData,
  PlayerData,
  Table,
} from '../../models/game';
import { GameStoreState } from '../../store/game/reducer';

export function startGame(token: string): Promise<void> {
  return requests.put('/lobby/start', { token });
}

type GameStatePlayer = {
  login: string;
  hasPassed: boolean;
  biddedCoinsCount: number;
  last: { property?: number; money?: number };
};
type GameStateResponse = {
  myLogin: string;

  currentPlayer: string; //login of current turn player
  hand: {
    coinsCount: number;
    properties: number[];
    money: number[];
    biddedProperty: number | null;
  };
  players: GameStatePlayer[];
  table: { properties: number[]; money: number[] };

  ratedPlayers?: {
    login: string;
    pointsCount: number;
    handCoinsCount: number;
    money: number[];
  }[];
};

function toGameStoreState(resp: GameStateResponse): GameStoreState {
  const playerIndex = resp.players.findIndex((p) => p.login === resp.myLogin);
  const player: PlayerData = {
    nickname: resp.players[playerIndex].login,
    orderNumber: playerIndex + 1,
    passed: resp.players[playerIndex].hasPassed,
    bid: resp.players[playerIndex].biddedCoinsCount,
    lastBidProperty: resp.players[playerIndex].last.property,
    lastBidMoney: resp.players[playerIndex].last.money,
    isCurrentTurn: resp.myLogin === resp.currentPlayer,
  };

  const opponentsResponse = [...resp.players].map((player, i) => ({
    ...player,
    order: i + 1,
  }));
  opponentsResponse.splice(playerIndex, 1);
  const opponents: OpponentData[] = opponentsResponse.map((player, i) => ({
    nickname: player.login,
    orderNumber: player.order,
    passed: player.hasPassed,
    bid: player.biddedCoinsCount,
    lastBidProperty: player.last.property,
    lastBidMoney: player.last.money,
    isCurrentTurn: player.login === resp.currentPlayer,
  }));

  const hand: Hand = {
    properties: resp.hand.properties,
    coins: resp.hand.coinsCount,
    bidProperty: resp.hand.biddedProperty,
    money: resp.hand.money,
  };

  const table: Table = resp.table;

  let gamePhase: GamePhase;
  if (table.properties) gamePhase = GamePhase.BID_COINS;
  else if (table.money) gamePhase = GamePhase.BID_PROPERTY;
  else gamePhase = GamePhase.END;

  const finalRatings: FinalRating[] | undefined = resp.ratedPlayers
    ? resp.ratedPlayers.map((player) => ({
        nickname: player.login,
        score: player.pointsCount,
      }))
    : undefined;

  return {
    player,
    opponents,
    hand,
    table,
    gamePhase,
    finalRatings,
  };
}

export async function getGameState(token: string): Promise<GameStoreState> {
  const resp = await requests.post<GameStateResponse>('/game', { token });

  return toGameStoreState(resp);
}

export async function pass(token: string): Promise<void> {
  return requests.post<void>('/game/pass', { token });
}

export async function bidCoins(token: string, bid: string): Promise<void> {
  return requests.post<void>('/game/bid-coins', { token, bidAmount: Number(bid) });
}

export async function bidProperty(token: string, property: string): Promise<void> {
  return requests.post<void>('/game/bid-property', { token, property: Number(property) });
}
