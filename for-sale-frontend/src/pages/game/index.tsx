import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGameAPI } from '../../api/game/hooks';
import { useAppDispatch } from '../../hooks/redux';
import { clearAccountData } from '../../store/account/actions';
import { useToken } from '../../store/account/hooks';
import { clearGameStoreState } from '../../store/game/actions';
import { useGameStoreState } from '../../store/game/hooks';
import { homePagePath } from '../../constants/paths';
import { GameTable } from './GameTable';
import { OpponentsList } from './opponents/OpponentsList';
import { PlayerState } from './PlayerState';
import { SecondaryButton } from '../../components/common/Button';

const GamePageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const CornerButton = styled(SecondaryButton)`
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

export function GamePage() {
  const gameStoreState = useGameStoreState();
  const token = useToken();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useUpdatedGameState();

  function handleLeaveGame() {
    if (!token) return;

    (async function () {
      setIsLoading(true);
      try {
        dispatch(clearAccountData());
        dispatch(clearGameStoreState());
        navigate(homePagePath);
      } finally {
        setIsLoading(false);
      }
    })();
  }

  if (!gameStoreState) return null;

  const { opponents: players } = gameStoreState;

  return (
    <GamePageWrapper>
      <h1 className={'visually-hidden'}>For sale!</h1>
      <GameTable />
      <OpponentsList players={players} />
      <PlayerState />
      <CornerButton type='button' onClick={handleLeaveGame} disabled={isLoading}>
        Leave game
      </CornerButton>
    </GamePageWrapper>
  );
}

function useUpdatedGameState() {
  const gameApi = useGameAPI();

  //update game state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    async function updateGameStateInTimeout() {
      if (!gameApi) return;

      try {
        await gameApi!.updateGameState();
        // console.log('game state updated');
      } catch (e) {
        console.error(e);
      }

      if (gameApi) {
        timeout = setTimeout(() => updateGameStateInTimeout(), 5000);
      }
    }

    updateGameStateInTimeout();

    return () => clearTimeout(timeout);
  }, [gameApi]);
}
