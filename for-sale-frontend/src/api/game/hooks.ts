import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { useToken } from '../../store/account/hooks';
import { setGameStoreState } from '../../store/game/actions';
import { useRoomCode } from '../../store/room/hooks';
import { isAuthorizationError } from '../../utils/error';
import { accountPagePath } from '../../utils/paths';
import { bidCoins, bidProperty, getGameState, pass, startGame } from './api';

export function useGameAPI() {
  const token = useToken();
  const roomCode = useRoomCode();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMemo(() => {
    if (!token || !roomCode) return null;

    return {
      updateGameState: async () => {
        try {
          const gameState = await getGameState(token, roomCode);
          dispatch(setGameStoreState(gameState));
        } catch (e) {
          console.error(e);

          if (isAuthorizationError(e)) navigate(accountPagePath);
        }
      },
      startGame: () => startGame(token, roomCode),
      getGameState: () => getGameState(token, roomCode),
      pass: () => pass(token, roomCode),
      bidCoins: (bid: number) => bidCoins(token, roomCode, bid.toString()),
      bidProperty: (property: number) =>
        bidProperty(token, roomCode, property.toString()),
    };
  }, [token, roomCode, dispatch, navigate]);
}
