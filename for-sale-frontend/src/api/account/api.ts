import { runProcedure } from '..';

type AccountResponse = {
  RESULTS: [{ token: [string] }];
};

export async function logIntoAccount(login: string, password: string) {
  const response = await runProcedure<AccountResponse>('login', {
    param1: login,
    param2: password,
  });

  return response.RESULTS[0].token[0];
}

export async function registerAccount(
  nickname: string,
  login: string,
  password: string,
) {
  const response = await runProcedure<AccountResponse>('register', {
    param1: nickname,
    param2: login,
    param3: password,
  });

  return response.RESULTS[0].token[0];
}

type IsTokenActiveResponse = {
  RESULTS: [{ isTokenActive: [number] }];
};

export async function isTokenActive(token: string) {
  const response = await runProcedure<IsTokenActiveResponse>('isTokenActive', {
    param1: token,
  });

  return response.RESULTS[0].isTokenActive[0] === 1;
}
