import { maxDeckCardsCount } from 'src/constants/cards';
import { shuffle, createNumberArray } from 'src/utils/array';

export class Deck {
  private _properties: number[];
  private _money: number[];
  private _playerCount: number;

  public get propertyCount(): number {
    return this._properties.length;
  }
  public get moneyCount(): number {
    return this._money.length;
  }

  constructor(playerCount: number) {
    this._playerCount = playerCount;

    let cardsCount = maxDeckCardsCount;
    if (playerCount == 4) cardsCount -= 2;
    else if (playerCount == 3) cardsCount -= 6;

    cardsCount = 6;

    //properties
    const propertyCards = shuffle(createNumberArray(maxDeckCardsCount, 1));

    //money cards
    const uniqueMoneyCards = createNumberArray(Math.floor(maxDeckCardsCount / 2) + 1);
    uniqueMoneyCards.splice(1, 1); //there shouldn't be money '1'
    const moneyCards = shuffle([...uniqueMoneyCards, ...uniqueMoneyCards]);

    this._properties = propertyCards.slice(0, cardsCount);
    this._money = moneyCards.slice(0, cardsCount);
  }

  public getProperties() {
    return this._properties.splice(0, this._playerCount);
  }

  public getMoney() {
    return this._money.splice(0, this._playerCount);
  }
}
