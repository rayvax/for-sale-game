import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createRoom } from '../../../api/rooms/api';
import { PrimaryButton } from '../../../components/common/Button';
import { Form, Label } from '../../../components/common/Form';
import { useToken } from '../../../store/account/hooks';
import { roomPath } from '../../../utils/paths';

const CreateRoomForm = styled(Form)`
  max-width: 500px;
  margin: 0 auto;
`;

type RoomInputData = {
  password: string;
  turnDuration: number;
};

const initialInputData: RoomInputData = {
  password: '',
  turnDuration: 30,
};

export function CreateRoomPage() {
  const navigate = useNavigate();

  const [roomInputData, setRoomInputData] =
    useState<RoomInputData>(initialInputData);
  const token = useToken();

  const isValid = roomInputData.turnDuration >= 30;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setRoomInputData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSumbit(event: React.FormEvent) {
    event.preventDefault();

    if (!isValid || !token) return;

    createRoom(
      token,
      roomInputData.password ?? 'NULL',
      roomInputData.turnDuration,
    ).then((code) => {
      if (code) navigate(roomPath(code));
    });
  }

  return (
    <div>
      <h1>Create room</h1>
      <CreateRoomForm onSubmit={handleSumbit}>
        <Label>
          Turn duration:
          <input
            type='number'
            name='turnDuration'
            id='duration'
            value={roomInputData.turnDuration}
            onChange={handleChange}
          />
        </Label>

        <Label>
          Password:
          <input
            type='text'
            name='password'
            id='password'
            value={roomInputData.password}
            onChange={handleChange}
          />
        </Label>

        <PrimaryButton type='submit' disabled={!isValid}>
          Create
        </PrimaryButton>
      </CreateRoomForm>
    </div>
  );
}
