export type Account = {
  login: string;
  token: string;
};
export type Room = {
  logins: string[]; // logins array
  code: string;
  hasStartedGame?: boolean;
};
