export class CreateGameDto {
  readonly roomCode: string;
  readonly logins: string[];
}

export class PlayerDto {
  // readonly roomCode: string;
  // readonly login: string;
  readonly token: string;
}

export class BidCoinsDto extends PlayerDto {
  readonly bidAmmount: number;
}

export class BidPropertyDto extends PlayerDto {
  readonly property: number;
}
