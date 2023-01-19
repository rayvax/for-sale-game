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
    <div>
      <h1>Room</h1>
      <h2>Room members: </h2>
      <ul>
        {members.map((member) => (
          <li key={`room-member-${member}`}>{member}</li>
        ))}
      </ul>
      <button onClick={() => handleLeaveRoom()} disabled={isLoading}>
        Leave
      </button>

      <button onClick={handleStartGame} disabled={!canStartGame || isLoading}>
        Start game
      </button>
      {!canStartGame && <span>Should be at least 3 people to start the game</span>}
    </div>
  );
}

function useUpdateRoom() {
  const dispatch = useAppDispatch();
  const token = useToken();

  useEffect(() => {
    if (!token) return;

    async function updateRoom(token: string) {
      try {
        const roomState = await getRoomState(token);
        dispatch(updateRoomState({ roomState }));
      } catch (e) {
        console.error(e);
      }
    }

    updateRoom(token);

    const updateRoomStateInterval = setInterval(() => updateRoom(token), 5000);

    return () => clearInterval(updateRoomStateInterval);
  }, [token, dispatch]);
}

function useNavigateToGame(hasGameStarted: boolean) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasGameStarted) return;

    navigate(gamePath);
  }, [hasGameStarted, navigate]);
}
