import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { markDbError } from '../../api/game/api';
import { useGameAPI } from '../../api/game/hooks';
import { leaveRoom } from '../../api/rooms/api';
import { GamePhase } from '../../models/game';
import { useToken } from '../../store/account/hooks';
import {
  useGamePhase,
  useGameStoreState,
  useUpdateTurnEndState,
} from '../../store/game/hooks';
import { useRoomCode } from '../../store/room/hooks';
import { getErrorMessage } from '../../utils/error';
import { roomsDashboardPath } from '../../utils/paths';
import { GameTable } from './GameTable';
import { OpponentsList } from './opponents/OpponentsList';
import { PlayerState } from './PlayerState';

const GamePageWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const CornerButtonsList = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

export function GamePage() {
  const gameStoreState = useGameStoreState();
  const gamePhase = useGamePhase();
  const token = useToken();
  const roomCode = useRoomCode();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useUpdatedGameState(roomCode);

  function handleLeaveGame() {
    if (!token || !roomCode) return;

    (async function () {
      setIsLoading(true);
      try {
        await leaveRoom(token, roomCode);
        navigate(roomsDashboardPath);
      } finally {
        setIsLoading(false);
      }
    })();
  }

  function handleGoToRoomsList() {
    navigate(roomsDashboardPath);
  }

  if (!gameStoreState) return null;

  const { opponents: players } = gameStoreState;

  return (
    <GamePageWrapper>
      <h1 className={'visually-hidden'}>For sale!</h1>
      <GameTable />
      <OpponentsList players={players} />
      <PlayerState />
      {gamePhase !== GamePhase.END ? (
        <CornerButtonsList
          type='button'
          onClick={handleLeaveGame}
          disabled={isLoading}
        >
          Leave game
        </CornerButtonsList>
      ) : (
        <CornerButtonsList
          type='button'
          onClick={handleGoToRoomsList}
          disabled={isLoading}
        >
          Go to rooms list
        </CornerButtonsList>
      )}
    </GamePageWrapper>
  );
}

function useUpdatedGameState(code: string | null) {
  const gameApi = useGameAPI();
  const stateRoomCode = useRoomCode();
  useUpdateTurnEndState();

  //update game state
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    async function updateGameStateInTimeout() {
      if (!code || code !== stateRoomCode || !gameApi) return;

      try {
        await gameApi!.updateGameState();
        // console.log('game state updated');
      } catch (e) {
        console.error(e);
        markDbError(getErrorMessage(e));
      }

      if (gameApi) {
        timeout = setTimeout(() => updateGameStateInTimeout(), 5000);
      }
    }

    updateGameStateInTimeout();

    return () => clearTimeout(timeout);
  }, [gameApi, code, stateRoomCode]);
}
