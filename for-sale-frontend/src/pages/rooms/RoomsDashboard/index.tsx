import { useState } from 'react';
import { Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useShowRooms } from '../../../api/rooms/hooks';
import { PrimaryButton } from '../../../components/common/Button';
import { createRoomPagePath } from '../../../utils/paths';
import { PasswordModal } from './PasswordModal';
import { RoomsTable } from './RoomsTable';

const RoomsDashboardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  margin-top: 1rem;
  gap: 2rem;

  position: relative;
`;

const RoomsDashboardHeading = styled.h1`
  margin: 0;
`;

const CreateRoomButton = styled(PrimaryButton)`
  display: flex;
  align-items: center;
  vertical-align: middle;
  margin-bottom: 1rem;
`;
const CreateRoomIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -4px;
`;

type PasswordModalData = {
  isOpen: boolean;
  roomCode: string;
};

const defaultPasswordModalData: PasswordModalData = {
  isOpen: false,
  roomCode: '',
};

function RoomsDashboard() {
  const rooms = useShowRooms();
  const navigate = useNavigate();
  const [passwordModalData, setPasswordModalData] = useState(
    defaultPasswordModalData,
  );

  return (
    <RoomsDashboardWrapper>
      <RoomsDashboardHeading>Rooms</RoomsDashboardHeading>
      <CreateRoomButton onClick={() => navigate(createRoomPagePath)}>
        <CreateRoomIconWrapper>
          <Plus />
        </CreateRoomIconWrapper>
        Create room
      </CreateRoomButton>
      {rooms && (
        <RoomsTable
          rooms={rooms}
          openPasswordModal={(roomCode) =>
            setPasswordModalData({ isOpen: true, roomCode })
          }
        />
      )}
      {passwordModalData.isOpen && (
        <PasswordModal
          roomCode={passwordModalData.roomCode}
          closeModal={() => setPasswordModalData(defaultPasswordModalData)}
        />
      )}
    </RoomsDashboardWrapper>
  );
}

export default RoomsDashboard;
