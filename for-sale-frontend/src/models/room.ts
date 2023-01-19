export type Room = {
  code: string;
  admin: { login: string; nickname: string };
  hasPassword: boolean;
  hasGameStarted: boolean;
  hasEntered: boolean;
};

export type RoomMember = { login: string; nickname: string; isAdmin: boolean };
export type RoomState = {
  hasGameStarted: boolean;
  turnDuration: number;
  members: RoomMember[];
};
