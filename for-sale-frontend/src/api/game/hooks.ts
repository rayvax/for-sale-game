import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { useToken } from '../../store/account/hooks';
import { setGameStoreState } from '../../store/game/actions';
import { isAuthorizationError } from '../../utils/error';
import { homePagePath } from '../../constants/paths';
import { bidCoins, bidProperty, getGameState, pass, startGame } from './api';

export function useGameAPI() {
  const token = useToken();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return useMemo(() => {
    if (!token) return null;

    return {
      updateGameState: async () => {
        try {
          const gameState = await getGameState(token);
          dispatch(setGameStoreState(gameState));
        } catch (e) {
          console.error(e);

          if (isAuthorizationError(e)) navigate(homePagePath);
        }
      },
      startGame: () => startGame(token),
      getGameState: () => getGameState(token),
      pass: () => pass(token),
      bidCoins: (bid: number) => bidCoins(token, bid.toString()),
      bidProperty: (property: number) => bidProperty(token, property.toString()),
    };
  }, [token, dispatch, navigate]);
}
