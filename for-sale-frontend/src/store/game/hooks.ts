import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { GamePhase, Hand, PlayerData } from '../../models/game';
import { setTurnEndsIn } from './actions';

export function useGameStoreState() {
  return useAppSelector((state) => state.game);
}

export function useUpdateTurnEndState() {
  const GameStoreState = useGameStoreState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!GameStoreState?.turnEndsIn) return;

    const turnEndInterval = setInterval(() => {
      if (!GameStoreState.turnEndsIn || GameStoreState.turnEndsIn <= 0) return;
      dispatch(setTurnEndsIn(GameStoreState.turnEndsIn - 1));
    }, 1000);

    return () => clearInterval(turnEndInterval);
  }, [GameStoreState?.turnEndsIn, dispatch]);
}

export function useTurnEndsIn(): number {
  const GameStoreState = useGameStoreState();

  return GameStoreState?.turnEndsIn ?? 0;
}

export function useGamePhase(): GamePhase {
  const GameStoreState = useGameStoreState();
  return GameStoreState?.gamePhase ?? GamePhase.END;
}

export function usePlayerData(): PlayerData | null {
  const GameStoreState = useGameStoreState();
  return GameStoreState?.player ?? null;
}

export function useHand(): Hand | null {
  const GameStoreState = useGameStoreState();
  return GameStoreState?.hand ?? null;
}
