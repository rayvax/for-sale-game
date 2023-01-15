import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Game } from 'src/models/game.model';
import { parseErrorMessage } from 'src/utils/errot';
import { BidCoinsDto, BidPropertyDto, CreateGameDto, PlayerDto } from './game.dtos';

type GamesList = { [key: string]: Game };

@Injectable()
export class GameService {
  private gamesList: GamesList;

  constructor() {
    this.gamesList = {};
  }

  public createGame({ roomCode, logins }: CreateGameDto) {
    this.gamesList[roomCode] = new Game(logins);
  }

  public getGameState({ roomCode, login }: PlayerDto) {
    if (!this.gamesList[roomCode])
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);

    try {
      return this.gamesList[roomCode].getGameState(login);
    } catch (e) {
      throw new HttpException(parseErrorMessage(e), HttpStatus.BAD_REQUEST);
    }
  }

  public bidCoins({ roomCode, login, bidAmmount }: BidCoinsDto) {
    try {
      this.gamesList[roomCode].bidCoins(login, bidAmmount);
    } catch (e) {
      throw new HttpException(parseErrorMessage(e), HttpStatus.BAD_REQUEST);
    }
  }

  public pass({ roomCode, login }: PlayerDto) {
    try {
      this.gamesList[roomCode].pass(login);
    } catch (e) {
      throw new HttpException(parseErrorMessage(e), HttpStatus.BAD_REQUEST);
    }
  }

  public bidProperty({ roomCode, login, property }: BidPropertyDto) {
    try {
      this.gamesList[roomCode].bidProperty(login, property);
    } catch (e) {
      throw new HttpException(parseErrorMessage(e), HttpStatus.BAD_REQUEST);
    }
  }

  public getAllGames() {
    return this.gamesList;
  }
}
