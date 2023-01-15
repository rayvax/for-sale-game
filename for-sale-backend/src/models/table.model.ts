import { Deck } from './deck.model';
import { GamePhase } from './game.model';

export class Table {
  private _deck: Deck;
  private _properties?: number[];
  private _money?: number[];

  public get properties(): number[] {
    return this._properties;
  }
  public get propertyCount(): number {
    return this._properties.length;
  }

  public get money(): number[] {
    return this._money;
  }
  public get moneyCount(): number {
    return this._money.length;
  }

  constructor(deck: Deck) {
    this._deck = deck;
    this.startNextRound('BID_COINS');
  }

  public startNextRound(gamePhase: GamePhase) {
    switch (gamePhase) {
      case 'BID_COINS':
        this._properties = this._deck.getProperties().sort();
        break;
      case 'BID_PROPERTY':
        this._money = this._deck.getMoney().sort();
        break;
    }
  }

  public popProperty() {
    if (!this._properties) throw new Error('No property on table');

    return this._properties.shift();
  }
  public popMoney() {
    if (!this._money) throw new Error('No money on table');

    return this._money.shift();
  }
}
