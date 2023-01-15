export class Player {
  private _login: string;
  private _hasPassed: boolean;
  private _handCoinsCount: number;
  private _biddedCoinsCount: number;

  private _hand: {
    properties: number[];
    money: number[];

    biddedProperty: number | null;
  };

  private _last: {
    property?: number; //taken or bid
    money?: number; //taken
  };

  public get login(): string {
    return this._login;
  }

  public get hasPassed(): boolean {
    return this._hasPassed;
  }

  public get handCoinsCount(): number {
    return this._handCoinsCount;
  }

  public get biddedCoinsCount(): number {
    return this._biddedCoinsCount;
  }

  public get hand() {
    return this._hand;
  }

  public get last() {
    return this._last;
  }

  constructor(login: string, coinsCount: number) {
    this._login = login;
    this._handCoinsCount = coinsCount;

    this._hasPassed = false;
    this._biddedCoinsCount = 0;
    this._hand = { properties: [], money: [], biddedProperty: null };
    this._last = {};
  }

  /**
   * @param property earned property
   */
  public pass(property: number) {
    this._handCoinsCount += Math.ceil(this._biddedCoinsCount / 2);
    this._biddedCoinsCount = 0;
    this._hasPassed = true;
    this.takeProperty(property);
  }

  public winCoinsBid(property: number) {
    this._biddedCoinsCount = 0;
    this.takeProperty(property);
  }

  public bidCoins(bidAmmount: number) {
    if (bidAmmount <= 0) {
      throw new Error('Bid should be more than 0');
    }

    if (bidAmmount > this._handCoinsCount + this._biddedCoinsCount) {
      throw new Error('Not enought coins for bid');
    }

    this._handCoinsCount -= bidAmmount - this._biddedCoinsCount;
    this._biddedCoinsCount = bidAmmount;
  }

  public bidProperty(property: number) {
    if (this._hand.biddedProperty) {
      throw new Error('You already have bid property');
    }

    const targetIndex = this._hand.properties.indexOf(property);
    if (targetIndex === -1) {
      throw new Error("You don't this property in hand");
    }

    this._hand.biddedProperty = this._hand.properties[targetIndex];
    this._hand.properties.splice(targetIndex);
  }

  public takeMoney(money: number) {
    this._hand.money = [...this._hand.money, money];
    this._last.money = money;

    this._last.property = this._hand.biddedProperty;
    this._hand.biddedProperty = null;
  }

  public startNewRound() {
    this._hasPassed = false;
  }

  private takeProperty(property: number) {
    this._hand.properties = [...this._hand.properties, property];
    this._last.property = property;
  }
}