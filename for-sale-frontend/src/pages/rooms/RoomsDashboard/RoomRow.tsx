import { useState } from 'react';
import { Lock } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { enterRoom } from '../../../api/rooms/api';
import { PrimaryButton } from '../../../components/common/Button';
import { ErrorSpan } from '../../../components/common/Span';
import { colors } from '../../../constants/theme';
import { Room } from '../../../models/room';
import { useAccountLogin, useToken } from '../../../store/account/hooks';
import { getErrorMessage } from '../../../utils/error';
import { gamePath, homePagePath, roomPath } from '../../../utils/paths';

const StyledRoomItem = styled.tr``;
const RoomItemColumn = styled.td`
  padding: 0.5rem 1rem;
  border: 2px solid ${colors.text};
`;
const PasswordColumn = styled(RoomItemColumn)`
  text-align: center;
`;
const ButtonColumn = styled(RoomItemColumn)`
  border: none;

  & button {
    width: 100%;
  }
`;

type RoomItemProps = {
  room: Room;
  openPasswordModal: (room: string) => void;
};

export function RoomItem({ room, openPasswordModal }: RoomItemProps) {
  const token = useToken();
  const login = useAccountLogin();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function handleEnterRoom() {
    if (!token) {
      navigate(homePagePath);
      return;
    }

    if (room.hasEntered) {
      if (room.hasGameStarted) navigate(gamePath(room.code));
      else navigate(roomPath(room.code));

      return;
    }

    if (room.hasPassword) {
      openPasswordModal(room.code);
      return;
    }

    try {
      if (room.admin.login !== login) {
        await enterRoom(token, room.code);
      }
      navigate(roomPath(room.code));
    } catch (e) {
      console.error(e);
      setError(getErrorMessage(e));
    }
  }

  return (
    <StyledRoomItem>
      <RoomItemColumn>{room.code}</RoomItemColumn>
      <RoomItemColumn>{room.admin.nickname}</RoomItemColumn>
      <PasswordColumn>{room.hasPassword && <Lock />}</PasswordColumn>
      <ButtonColumn>
        <PrimaryButton
          onClick={handleEnterRoom}
          disabled={!room.hasEntered && room.hasGameStarted}
        >
          {room.hasEntered ? 'Return' : 'Enter room'}
        </PrimaryButton>
        {error && <ErrorSpan>{error}</ErrorSpan>}
      </ButtonColumn>
    </StyledRoomItem>
  );
}
