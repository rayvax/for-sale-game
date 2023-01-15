export class CreateGameDto {
  readonly roomCode: string;
  readonly logins: string[];
}

export class PlayerDto {
  readonly roomCode: string;
  readonly login: string;
}

export class BidCoinsDto extends PlayerDto {
  bidAmmount: number;
}
