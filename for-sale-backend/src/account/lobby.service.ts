import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MAX_PLAYERS_COUNT, MIN_PLAYERS_COUNT } from 'src/constants/game';
import { GameService } from 'src/game/game.service';
import { getRandomPositiveNumber } from 'src/utils/random';
import { CreateAccountDto, StartGameInRoomDto } from './lobby.dtos';
import { Account, Room } from './lobby.model';

@Injectable()
export class LobbyService {
  private static _accounts: Account[];
  private static _rooms: Room[];

  constructor(private gameService: GameService) {
    LobbyService._accounts = [];
    LobbyService._rooms = [];
  }

  public createAccount({ login }: CreateAccountDto) {
    if (LobbyService._accounts.some((account) => account.login === login)) {
      throw new HttpException('This login is already in use', HttpStatus.BAD_REQUEST);
    }

    const token = this.getUniqueAccountToken();
    LobbyService._accounts = [...LobbyService._accounts, { login, token }];

    const roomCode = this.addAccountToRoom(
      LobbyService._accounts[LobbyService._accounts.length - 1],
    );

    return {
      token,
      roomCode,
    };
  }

  public startGame({ token }: StartGameInRoomDto) {
    const account = this.getAccount(token);
    if (!account) {
      throw new HttpException(
        'Problem accured during authorization',
        HttpStatus.FORBIDDEN,
      );
    }

    const room = LobbyService._rooms.find((room) => room.logins.includes(account.login));
    if (!room) {
      throw new HttpException("This room doesn't exist", HttpStatus.BAD_REQUEST);
    }
    if (!room.logins.includes(account.login)) {
      throw new HttpException('Wrong room code', HttpStatus.BAD_REQUEST);
    }
    if (room.hasStartedGame) {
      throw new HttpException('Game has already started', HttpStatus.BAD_REQUEST);
    }
    if (room.logins.length < MIN_PLAYERS_COUNT) {
      throw new HttpException(
        `You need at least ${MIN_PLAYERS_COUNT} plaeyrs to start`,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.gameService.createGame({
      roomCode: room.code,
      logins: room.logins,
    });
    room.hasStartedGame = true;
  }

  private getUniqueAccountToken() {
    let result;
    do {
      result = getRandomPositiveNumber().toString();
    } while (LobbyService._accounts.some((account) => account.token === result));
    return result;
  }

  private getUniqueRoomCode() {
    let result;
    do {
      result = getRandomPositiveNumber().toString();
    } while (LobbyService._rooms.some((room) => room.code === result));
    return result;
  }

  private addAccountToRoom(account: Account) {
    let targetRoom: Room | undefined =
      LobbyService._rooms[LobbyService._rooms.length - 1];
    if (
      targetRoom &&
      !targetRoom.hasStartedGame &&
      targetRoom.logins.length < MAX_PLAYERS_COUNT
    ) {
      //add to existing room
      targetRoom.logins = [...targetRoom.logins, account.login];

      //start game if max players
      if (targetRoom.logins.length >= MAX_PLAYERS_COUNT) {
        this.gameService.createGame({
          roomCode: targetRoom.code,
          logins: targetRoom.logins,
        });
        targetRoom.hasStartedGame = true;
      }
      return targetRoom.code;
    }

    //add to new room
    targetRoom = {
      code: this.getUniqueRoomCode(),
      logins: [account.login],
    };
    LobbyService._rooms = [...LobbyService._rooms, targetRoom];
    return targetRoom.code;
  }

  private getAccount(token: string): Account | null {
    return LobbyService._accounts.find((account) => account.token === token) ?? null;
  }
}
