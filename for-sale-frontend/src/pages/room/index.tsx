import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startGame } from '../../api/game/api';
import { getRoomState } from '../../api/lobby/api';
import { useAppDispatch } from '../../hooks/redux';
import { useToken } from '../../store/account/hooks';
import { clearRoomState, updateRoomState } from '../../store/room/actions';
import { useRoomState } from '../../store/room/hooks';
import { gamePath, homePagePath } from '../../constants/paths';
import { clearAccountData } from '../../store/account/actions';
import { isAuthorizationError } from '../../utils/error';
import { PrimaryButton } from '../../components/common/Button';
import styled from 'styled-components';
import { colors } from '../../constants/theme';

const RoomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  padding-top: 1rem;
`;

const RoomH1 = styled.h1`
  margin: 0;
`;

const RoomMembersSection = styled.div`
  padding: 1rem;

  background-color: ${colors.bg1};
  border: 3px solid ${colors.bg2};
  border-radius: 20px;
`;

const RoomH2 = styled.h2`
  margin: 0;
`;

const PlayersList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const ButtonsList = styled.div`
  display: flex;
  gap: 2rem;
`;

export function RoomPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = useToken();
  const roomState = useRoomState();

  const [isLoading, setIsLoading] = useState(false);

  useUpdateRoom();
  useNavigateToGame(!!roomState?.hasGameStarted);

  function handleStartGame() {
    if (!token) return;

    (async function () {
      await startGame(token);
      navigate(gamePath);
    })();
  }

  function handleLeaveRoom() {
    if (!token) return;

    (async function () {
      setIsLoading(true);
      try {
        dispatch(clearAccountData());
        dispatch(clearRoomState());
        navigate(homePagePath);
      } finally {
        setIsLoading(false);
      }
    })();
  }

  if (!roomState) return <span>Loading</span>;

  const { members } = roomState;
  const canStartGame = members.length >= 3;

  return (
    <RoomWrapper>
      <RoomH1>Room</RoomH1>
      <RoomMembersSection>
        <RoomH2>Room members:</RoomH2>
        <PlayersList>
          {members.map((member) => (
            <li key={`room-member-${member}`}>{member}</li>
          ))}
        </PlayersList>
      </RoomMembersSection>
      <ButtonsList>
        <PrimaryButton onClick={() => handleLeaveRoom()} disabled={isLoading}>
          Leave
        </PrimaryButton>

        <PrimaryButton onClick={handleStartGame} disabled={!canStartGame || isLoading}>
          Start game
        </PrimaryButton>
      </ButtonsList>
      {!canStartGame && <span>Should be at least 3 people to start the game</span>}
    </RoomWrapper>
  );
}

function useUpdateRoom() {
  const dispatch = useAppDispatch();
  const token = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    async function updateRoom(token: string) {
      try {
        const roomState = await getRoomState(token);
        dispatch(updateRoomState({ roomState }));
      } catch (e) {
        console.error(e);
        if (isAuthorizationError(e)) {
          dispatch(clearAccountData());
          dispatch(clearRoomState());
          navigate(homePagePath);
        }
      }
    }

    updateRoom(token);

    const updateRoomStateInterval = setInterval(() => updateRoom(token), 5000);

    return () => clearInterval(updateRoomStateInterval);
  }, [token, dispatch, navigate]);
}

function useNavigateToGame(hasGameStarted: boolean) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasGameStarted) return;

    navigate(gamePath);
  }, [hasGameStarted, navigate]);
}
