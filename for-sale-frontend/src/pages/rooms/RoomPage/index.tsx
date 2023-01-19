import { useEffect } from 'react';
import { Star } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';
import { startGame } from '../../../api/game/api';
import { getRoomState, leaveRoom } from '../../../api/rooms/api';
import { colors } from '../../../constants/theme';
import { useAppDispatch } from '../../../hooks/redux';
import { useAccountLogin, useToken } from '../../../store/account/hooks';
import { saveRoomState } from '../../../store/room/actions';
import { useRoomState } from '../../../store/room/hooks';
import { gamePath, roomsDashboardPath } from '../../../utils/paths';
import NotFound from '../../errors/NotFound';

export function RoomPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { code } = useParams();
  const token = useToken();
  const login = useAccountLogin();

  const roomState = useRoomState();

  function handleLeaveRoom() {
    if (!token || !code) return;

    leaveRoom(token, code);
    navigate(roomsDashboardPath);
  }

  function handleStartGame() {
    if (!token || !code) return;

    (async function () {
      await startGame(token, code);
      navigate(gamePath(code));
    })();
  }

  useEffect(() => {
    if (!code || !roomState?.hasGameStarted) return;

    navigate(gamePath(code));
  }, [roomState?.hasGameStarted, code, navigate]);

  useEffect(() => {
    if (!token || !code) return;

    async function updateRoomState(token: string, code: string) {
      try {
        const roomState = await getRoomState(token, code);
        dispatch(saveRoomState({ roomState, code }));
      } catch (e) {
        console.error(e);
      }
    }

    updateRoomState(token, code);

    const updateRoomStateInterval = setInterval(
      () => updateRoomState(token, code),
      5000,
    );

    return () => clearInterval(updateRoomStateInterval);
  }, [token, code, dispatch]);

  if (!code) return <NotFound />;
  if (!roomState) return <span>Loading</span>;

  const { members, turnDuration } = roomState;
  const admin = members.find((member) => member.isAdmin);
  const canStartGame = members.length >= 3;

  return (
    <div>
      <h1>Room {code}</h1>
      <h2>Room params:</h2>
      <ul>
        <li>Turn duration: {turnDuration}</li>
      </ul>
      <h2>Room members: </h2>
      <ul>
        {members.map((member) => (
          <li key={`room-member-${member.nickname}`}>
            {member.nickname}{' '}
            {member.isAdmin && (
              <Star color={colors.primary} fill={colors.primary} />
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(roomsDashboardPath)}>Back</button>
      {admin?.login === login ? (
        <>
          <button onClick={handleStartGame} disabled={!canStartGame}>
            Start game
          </button>
          {!canStartGame && (
            <span>Should be at least 3 people to start the game</span>
          )}
        </>
      ) : (
        <button onClick={handleLeaveRoom}>Leave</button>
      )}
    </div>
  );
}
