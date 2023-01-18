import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { LobbyService } from 'src/account/lobby.service';
import { Game } from 'src/game/models/game.model';
import { parseErrorMessage } from 'src/utils/errot';
import { BidCoinsDto, BidPropertyDto, CreateGameDto, PlayerDto } from './game.dtos';

type GamesList = { [key: string]: Game };

@Injectable()
export class GameService {
  private static _gamesList: GamesList;

  constructor(
    @Inject(forwardRef(() => LobbyService)) private lobbyService: LobbyService,
  ) {
    GameService._gamesList = {};
  }

  public createGame({ roomCode, logins }: CreateGameDto) {
    GameService._gamesList[roomCode] = new Game(logins);
  }

  public getGameState({ token }: PlayerDto) {
    const { roomCode, login } = this.lobbyService.getLobbyData(token);
    if (!GameService._gamesList[roomCode])
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);

    try {
      return GameService._gamesList[roomCode].getGameState(login);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public bidCoins({ token, bidAmmount }: BidCoinsDto) {
    const { roomCode, login } = this.lobbyService.getLobbyData(token);
    try {
      GameService._gamesList[roomCode].bidCoins(login, bidAmmount);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public pass({ token }: PlayerDto) {
    const { roomCode, login } = this.lobbyService.getLobbyData(token);
    try {
      GameService._gamesList[roomCode].pass(login);
    } catch (e) {
      this.throwHttpException(e);
    }
  }

  public bidProperty({ token, property }: BidPropertyDto) {
    const { roomCode, login } = this.lobbyService.getLobbyData(token);
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
