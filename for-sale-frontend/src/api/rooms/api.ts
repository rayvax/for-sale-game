import { runProcedure } from '..';
import { Room, RoomMember, RoomState } from '../../models/room';

export type ResponseRoom = {
  code: string[];
  adminLogin: string[];
  adminNickname: string[];
  hasPassword: number[];
  hasGameStarted: number[];
  hasEntered: number[];
};
export type RoomsResponse = {
  RESULTS: [ResponseRoom];
};

function responseToRooms(response: ResponseRoom): Room[] {
  return response.code.map((code, i) => ({
    code,
    admin: {
      login: response.adminLogin[i],
      nickname: response.adminNickname[i],
    },
    hasPassword: response.hasPassword[i] === 1,
    hasGameStarted: response.hasGameStarted[i] === 1,
    hasEntered: response.hasEntered[i] === 1,
  }));
}

export async function showRooms(token: string) {
  const resp = await runProcedure<RoomsResponse>('showRooms', {
    param1: token,
  });

  return responseToRooms(resp.RESULTS[0]);
}

export type RoomStateResponse = {
  RESULTS: [
    { hasGameStarted: [number] },
    { login: string[]; nickname: string[]; isAdmin: number[] },
    { turnDuration: [number] },
  ];
};

function toRoomState(response: RoomStateResponse): RoomState {
  const [
    { hasGameStarted },
    { login: logins, nickname, isAdmin },
    { turnDuration },
  ] = response.RESULTS;

  const roomMembers: RoomMember[] = logins.map((login, i) => ({
    login,
    nickname: nickname[i],
    isAdmin: isAdmin[i] === 1,
  }));

  return {
    hasGameStarted: hasGameStarted[0] === 1,
    turnDuration: turnDuration[0],
    members: roomMembers,
  };
}

export async function enterRoom(
  token: string,
  code: string,
  password?: string,
): Promise<RoomState> {
  const resp = await runProcedure<RoomStateResponse>('enterRoom', {
    param1: token,
    param2: code,
    param3: password ?? 'NULL',
  });

  return toRoomState(resp);
}

export async function getRoomState(
  token: string,
  code: string,
): Promise<RoomState> {
  const resp = await runProcedure<RoomStateResponse>('getRoomState', {
    param1: token,
    param2: code,
  });
  return toRoomState(resp);
}

export async function leaveRoom(token: string, code: string): Promise<void> {
  return await runProcedure<void>('leaveRoom', {
    param1: token,
    param2: code,
  });
}

type CreateRoomResponse = {
  RESULTS: [{ code: [string] }];
};

export async function createRoom(
  token: string,
  password: string,
  turnDuration: number,
): Promise<string> {
  const resp = await runProcedure<CreateRoomResponse>('createRoom', {
    param1: token,
    param2: password,
    param3: turnDuration.toString(),
  });
  return resp.RESULTS[0].code[0];
}
