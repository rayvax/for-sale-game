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
      this.throwHttpException(e);
    }
  }

  public bidCoins({ roomCode, login, bidAmmount }: BidCoinsDto) {
    try {
      this.gamesList[roomCode].bidCoins(login, bidAmmount);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public pass({ roomCode, login }: PlayerDto) {
    try {
      this.gamesList[roomCode].pass(login);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public bidProperty({ roomCode, login, property }: BidPropertyDto) {
    try {
      this.gamesList[roomCode].bidProperty(login, property);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public getAllGames() {
    return this.gamesList;
  }

  private throwHttpException(error: unknown) {
    //http exception should be specifically thrown like
    //otherwise there just would be 500 code
    if (error instanceof HttpException) throw error;

    throw new HttpException(parseErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
