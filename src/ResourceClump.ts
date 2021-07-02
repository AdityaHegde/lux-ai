import {Position} from "./lux/Position";
import {Resource} from "./lux/Cell";
import {GameMap} from "./lux/GameMap";

export class ResourceClump {
  public type: string;
  public resource: Resource;
  public rallyPoint: Position;
  public amount: number;

  public constructor(resource: Resource, rallyPoint: Position) {
    this.type = resource.type;
    this.amount = resource.amount;
    this.rallyPoint = rallyPoint;
  }

  public isValid(gameMap: GameMap): boolean {
    const cell = gameMap.getCell(this.rallyPoint.x, this.rallyPoint.y);
    return cell?.hasResource();
  }
}
