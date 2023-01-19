import { requests } from '..';
import { RoomState } from '../../models/room';

function toRoomState(response: RoomStateResponse): RoomState {
  return {
    hasGameStarted: response.hasGameStarted,
    members: response.roomMembers,
  };
}

type RoomStateResponse = {
  roomMembers: string[];
  hasGameStarted: boolean;
};

export async function getRoomState(token: string): Promise<RoomState> {
  const resp = await requests.post<RoomStateResponse>('/lobby', { token });
  return toRoomState(resp);
}

type LoginResponse = {
  token: string;
};

export async function createAccount(login: string) {
  const resp = await requests.post<LoginResponse>('/lobby/account', { login });

  return resp.token;
}
