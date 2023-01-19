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
  readonly bidAmount: number;
}

export class BidPropertyDto extends PlayerDto {
  readonly property: number;
}
