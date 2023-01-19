import { runProcedure } from '..';
import {
  FinalRating,
  GamePhase,
  Hand,
  OpponentData,
  PlayerData,
  Table,
} from '../../models/game';
import { GameStoreState } from '../../store/game/reducer';

export function startGame(token: string, roomCode: string): Promise<void> {
  return runProcedure<void>('startGame', {
    param1: token,
    param2: roomCode,
  });
}

type GameStateResponse = {
  RESULTS: [
    {
      nickname: [string];
      orderNumber: [number];
      passed: [number];
      bid: [number];
      lastBidProperty: [number | null];
      lastBidMoney: [number | null];
      turnEndsIn: [number | null];
    },
    {
      nickname: string[];
      orderNumber: number[];
      passed: number[];
      bid: number[];
      lastBidProperty: (number | null)[];
      lastBidMoney: (number | null)[];
      turnEndsIn: (number | null)[];
    },
    {
      handProperty: number[];
    },
    {
      handCoins: [number];
    },
    {
      bidProperty: [number];
    },
    {
      handValue: number[];
    },
    {
      tableProperty?: number[];
      tableMoney?: number[];
      nickname?: string[];
      score?: number[];
    },
    {},
  ];
};

function toGameStoreState(resp: GameStateResponse): GameStoreState {
  const { nickname: winnerNicknames, score } = resp.RESULTS[6];

  const playerResp = resp.RESULTS[0];
  const player: PlayerData = {
    nickname: playerResp.nickname[0],
    orderNumber: playerResp.orderNumber[0],
    passed: playerResp.passed[0] === 1,
    bid: playerResp.bid[0],
    lastBidProperty: playerResp.lastBidProperty[0] ?? undefined,
    lastBidMoney: playerResp.lastBidMoney[0] ?? undefined,
    isCurrentTurn: playerResp.turnEndsIn[0] !== null,
  };

  const {
    nickname,
    orderNumber,
    passed,
    bid,
    lastBidProperty,
    lastBidMoney,
    turnEndsIn: opponentTurnEndsIn,
  } = resp.RESULTS[1];
  const opponents: OpponentData[] = nickname.map((nickname, i) => ({
    nickname,
    orderNumber: orderNumber[i],
    passed: passed[i] === 1,
    bid: bid[i],
    lastBidProperty: lastBidProperty[i] ?? undefined,
    lastBidMoney: lastBidMoney[i] ?? undefined,
    isCurrentTurn: opponentTurnEndsIn[i] !== null,
  }));

  const hand: Hand = {
    properties: resp.RESULTS[2].handProperty,
    coins: resp.RESULTS[3].handCoins[0],
    bidProperty: resp.RESULTS[4].bidProperty[0],
    money: resp.RESULTS[5].handValue,
  };

  const table: Table = {
    properties: resp.RESULTS[6].tableProperty,
    money: resp.RESULTS[6].tableMoney,
  };

  let gamePhase: GamePhase;
  if (table.properties) gamePhase = GamePhase.BID_COINS;
  else if (table.money) gamePhase = GamePhase.BID_PROPERTY;
  else gamePhase = GamePhase.END;

  const finalRatings: FinalRating[] | undefined = winnerNicknames
    ? winnerNicknames.map((nickaname, i) => ({
        nickaname,
        score: score ? score[i] : 0,
      }))
    : undefined;

  return {
    player,
    opponents,
    turnEndsIn:
      opponentTurnEndsIn.find((p) => p !== null) ?? playerResp.turnEndsIn[0],
    hand,
    table,
    gamePhase,
    finalRatings,
  };
}

export async function getGameState(
  token: string,
  roomCode: string,
): Promise<GameStoreState> {
  const resp = await runProcedure<GameStateResponse>('getGameState', {
    param1: token,
    param2: roomCode,
  });

  return toGameStoreState(resp);
}

export async function pass(token: string, roomCode: string): Promise<void> {
  return runProcedure<void>('pass', { param1: token, param2: roomCode });
}

export async function bidCoins(
  token: string,
  roomCode: string,
  bid: string,
): Promise<void> {
  return runProcedure<void>('bidCoins', {
    param1: token,
    param2: roomCode,
    param3: bid,
  });
}

export async function bidProperty(
  token: string,
  roomCode: string,
  property: string,
): Promise<void> {
  return runProcedure<void>('bidProperty', {
    param1: token,
    param2: roomCode,
    param3: property,
  });
}

export async function markDbError(description: string) {
  return runProcedure<void>('markError', {
    param1: description,
  });
}
