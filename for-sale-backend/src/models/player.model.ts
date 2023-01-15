export class Player {
  private _login: string;
  private _hasPassed: boolean;
  private _biddedCoinsCount: number;

  private _hand: {
    coinsCount: number;
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
    return this._hand.coinsCount;
  }

  public get biddedCoinsCount(): number {
    return this._biddedCoinsCount;
  }

  public get biddedProperty(): number | null {
    return this._hand.biddedProperty;
  }

  public get pointsCount() {
    const moneyPoints = this._hand.money.reduce((prev, cur) => prev + cur, 0);
    return moneyPoints + this._hand.coinsCount;
  }

  public get publicData() {
    return {
      login: this._login,
      hasPassed: this._hasPassed,
      biddedCoinsCount: this._biddedCoinsCount,
      last: { ...this._last },
    };
  }

  public get hand() {
    return {
      coinsCount: this._hand,
      properties: [...this._hand.properties],
      money: [...this._hand.money],
    };
  }

  constructor(login: string, coinsCount: number) {
    this._login = login;

    this._hasPassed = false;
    this._biddedCoinsCount = 0;
    this._hand = { coinsCount, properties: [], money: [], biddedProperty: null };
    this._last = {};
  }

  /**
   * @param property earned property
   */
  public pass(property: number) {
    this._hand.coinsCount += Math.ceil(this._biddedCoinsCount / 2);
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

    if (bidAmmount > this._hand.coinsCount + this._biddedCoinsCount) {
      throw new Error('Not enought coins for bid');
    }

    this._hand.coinsCount -= bidAmmount - this._biddedCoinsCount;
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
    this._hand.properties.splice(targetIndex, 1);
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
