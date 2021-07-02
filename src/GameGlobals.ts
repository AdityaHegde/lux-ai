import {GameMap} from "./lux/GameMap";
import {City} from "./lux/City";
import {GameState} from "./lux/Agent";
import {Player} from "./lux/Player";
import {Worker} from "./worker/Worker";
import {CityWrapper} from "./CityWrapper";
import {Planner} from "./Planner";

export class GameGlobals {
  public gameMap: GameMap;
  public player: Player;
  public opponent: Player;
  public city: City;
  public planner: Planner;
  public cityWrapper: CityWrapper;
  public actions: Array<string>;

  public workerMap = new Map<string, Worker>();

  private static instance: GameGlobals;

  private constructor(planner: Planner, cityWrapper: CityWrapper) {
    this.planner = planner;
    this.cityWrapper = cityWrapper;
  }

  public static tick(gameState: GameState): GameGlobals {
    const player = gameState.players[gameState.id];
    const opponent = gameState.players[(gameState.id + 1) % 2];
    const gameMap = gameState.map;
    const city: City = player.cities.values().next().value;

    let shouldInit = false;

    if (!this.instance) {
      if (!city && city.citytiles.length === 0) return null;
      this.instance = new GameGlobals(new Planner(), new CityWrapper());
      shouldInit = true;
    }

    this.instance.player = player;
    this.instance.opponent = opponent;
    this.instance.gameMap = gameMap;
    this.instance.city = city;
    this.instance.actions = [];

    if (shouldInit) {
      this.instance.planner.init(this.instance);
    }

    return this.instance;
  }
}
