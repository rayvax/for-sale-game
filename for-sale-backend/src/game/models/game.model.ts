import { HttpException, HttpStatus } from '@nestjs/common';
import { shuffle } from 'src/utils/array';
import { Deck } from './deck.model';
import { Player } from './player.model';
import { Table } from './table.model';

export class Game {
  private _players: Player[]; //usernames
  private _table: Table;
  private _deck: Deck;
  private _currentPlayerIndex: number; //index of player in 'players' array

  constructor(logins: string[]) {
    this.initPlayers(logins);

    this._deck = new Deck(logins.length);
    this._table = new Table(this._deck);

    this._currentPlayerIndex = 0;
  }

  public getGameState(login: string) {
    if (this.gamePhase === 'FINAL') {
      const ratedPlayers = this._players.map((player) => player.finalScoreData);

      ratedPlayers.sort((a, b) => b.pointsCount - a.pointsCount);

      return ratedPlayers;
    }

    const playerIndex = this._players.findIndex((p) => p.login === login);

    return {
      currentPlayer: this.currentPlayer.login,
      hand: this._players[playerIndex].hand,
      players: this._players.map((player) => player.publicData),
      table: {
        properties: this._table.properties,
        money: this._table.money,
      },
    };
  }

  public bidCoins(login: string, newBidAmmount: number) {
    if (this.gamePhase !== 'BID_COINS')
      throw new HttpException(
        'This action is impossible in current game phase',
        HttpStatus.BAD_REQUEST,
      );

    if (!this.isCurrentTurnPlayer(login))
      throw new HttpException('It is not your turn', HttpStatus.BAD_REQUEST);

    if (this._players.some((p) => p.biddedCoinsCount >= newBidAmmount))
      throw new HttpException(
        'Your bid should become the biggest',
        HttpStatus.BAD_REQUEST,
      );

    this.currentPlayer.bidCoins(newBidAmmount);
    this.startNextTurn();
  }

  public pass(login: string) {
    const gamePhase = this.gamePhase;
    if (gamePhase !== 'BID_COINS')
      throw new HttpException(
        'This action is impossible in current game phase',
        HttpStatus.BAD_REQUEST,
      );

    if (!this.isCurrentTurnPlayer(login))
      throw new HttpException('It is not your turn', HttpStatus.BAD_REQUEST);

    const property = this._table.popProperty();
    this.currentPlayer.pass(property);
    this.startNextTurn();

    //check for last player
    if (this._table.propertyCount === 1) {
      const winnerProperty = this._table.popProperty();
      this.currentPlayer.winCoinsBid(winnerProperty);
      this.startNextRound(gamePhase);
    }
  }

  public bidProperty(login: string, property: number) {
    const gamePhase = this.gamePhase;
    if (gamePhase !== 'BID_PROPERTY')
      throw new HttpException(
        'This action is impossible in current game phase',
        HttpStatus.BAD_REQUEST,
      );

    //bid property
    const currentPlayer = this._players.find((p) => p.login === login);
    currentPlayer.bidProperty(property);

    //check whether all bidded
    if (this._players.every((p) => p.biddedProperty !== null)) {
      this.distributeMoney();

      if (this._deck.moneyCount > 0) this.startNextRound(gamePhase);
    }
  }

  private get currentPlayer(): Player {
    return this._players[this._currentPlayerIndex];
  }

  private get gamePhase(): GamePhase {
    if (this._table.propertyCount > 0 || this._deck.propertyCount > 0) return 'BID_COINS';
    if (this._table.moneyCount > 0 || this._deck.moneyCount > 0) return 'BID_PROPERTY';

    return 'FINAL';
  }

  private get nextTurnPlayer(): number {
    const result = this._currentPlayerIndex + 1;

    return result >= this._players.length ? 0 : result;
  }

  private initPlayers(logins: string[]) {
    const coinsCount = logins.length <= 4 ? 18 : 14;
    const shuffledLogins = shuffle(logins);

    this._players = shuffledLogins.map((login) => new Player(login, coinsCount));
  }

  private isCurrentTurnPlayer(login: string): boolean {
    const targetIndex = this._players.findIndex((p) => p.login === login);

    if (targetIndex === -1)
      throw new HttpException(
        'Player with that login is not in game',
        HttpStatus.BAD_REQUEST,
      );

    return targetIndex === this._currentPlayerIndex;
  }

  private startNextTurn() {
    this.changeCurrentTurnPlayer();
  }

  private startNextRound(gamePhase: GamePhase) {
    this._table.startNextRound();

    if (gamePhase === 'BID_COINS') {
      for (const player of this._players) player.startNewRound();
    }
  }

  private changeCurrentTurnPlayer() {
    do {
      this._currentPlayerIndex = this.nextTurnPlayer;
    } while (this._players[this._currentPlayerIndex].hasPassed);
  }

  private distributeMoney() {
    const ratedPlayers = [...this._players].sort(
      (a, b) => a.biddedProperty - b.biddedProperty,
    );

    for (const player of ratedPlayers) {
      const winMoney = this._table.popMoney();
      player.takeMoney(winMoney);
    }
  }
}

export type GamePhase = 'BID_COINS' | 'BID_PROPERTY' | 'FINAL';
