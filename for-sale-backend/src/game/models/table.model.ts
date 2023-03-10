import { HttpException, HttpStatus } from '@nestjs/common';
import { Deck } from './deck.model';

export class Table {
  private _deck: Deck;
  private _properties: number[]; //always sorted
  private _money: number[]; //always sorted

  public get properties(): number[] {
    return [...this._properties];
  }
  public get propertyCount(): number {
    return this._properties.length;
  }

  public get money(): number[] {
    return [...this._money];
  }
  public get moneyCount(): number {
    return this._money.length;
  }

  constructor(deck: Deck) {
    this._deck = deck;
    this._money = [];
    this.startNextRound();
  }

  public startNextRound() {
    if (this._deck.propertyCount > 0) {
      this._properties = this._deck.getProperties().sort((a, b) => a - b);
      return;
    }

    if (this._deck.moneyCount > 0) {
      this._money = this._deck.getMoney().sort((a, b) => a - b);
      return;
    }
  }

  public popProperty() {
    if (!this._properties)
      throw new HttpException('No property on table', HttpStatus.BAD_REQUEST);

    return this._properties.shift();
  }
  public popMoney() {
    if (!this._money)
      throw new HttpException('No money on table', HttpStatus.BAD_REQUEST);

    return this._money.shift();
  }
}
