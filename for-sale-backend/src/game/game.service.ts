import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Game } from 'src/game/models/game.model';
import { parseErrorMessage } from 'src/utils/errot';
import { BidCoinsDto, BidPropertyDto, CreateGameDto, PlayerDto } from './game.dtos';

type GamesList = { [key: string]: Game };

@Injectable()
export class GameService {
  private static _gamesList: GamesList;

  constructor() {
    GameService._gamesList = {};
  }

  public createGame({ roomCode, logins }: CreateGameDto) {
    GameService._gamesList[roomCode] = new Game(logins);
    console.log(GameService._gamesList);
  }

  public getGameState({ roomCode, login }: PlayerDto) {
    console.log(GameService._gamesList);
    if (!GameService._gamesList[roomCode])
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);

    try {
      return GameService._gamesList[roomCode].getGameState(login);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public bidCoins({ roomCode, login, bidAmmount }: BidCoinsDto) {
    try {
      GameService._gamesList[roomCode].bidCoins(login, bidAmmount);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public pass({ roomCode, login }: PlayerDto) {
    try {
      GameService._gamesList[roomCode].pass(login);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public bidProperty({ roomCode, login, property }: BidPropertyDto) {
    try {
      GameService._gamesList[roomCode].bidProperty(login, property);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public getAllGames() {
    return GameService._gamesList;
  }

  private throwHttpException(error: unknown) {
    //http exception should be specifically thrown like
    //otherwise there just would be 500 code
    if (error instanceof HttpException) throw error;

    throw new HttpException(parseErrorMessage(error), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
