import {Position} from "./lux/Position";
import {ResourceClump} from "./ResourceClump";
import {GameGlobals} from "./GameGlobals";
import {GAME_CONSTANTS} from "./lux/game_constants";

export const ResourceTypeToIdx = {
  [GAME_CONSTANTS.RESOURCE_TYPES.WOOD]: 0,
  [GAME_CONSTANTS.RESOURCE_TYPES.COAL]: 1,
  [GAME_CONSTANTS.RESOURCE_TYPES.URANIUM]: 1,
}
export const BUILD_RESOURCE = 0;
export const ENERGY_RESOURCE = 1;

export class Planner {
  public resourceClumps: Array<Array<ResourceClump>> = [[], [], []];
  public cityPlans: Array<Position> = [];

  public init(gameGlobals: GameGlobals): this {
    const startPos = gameGlobals.city.citytiles[0].pos;

    let x = startPos.x;
    let xNext = x + 1;
    let y = startPos.y;
    let yNext = y + 1;
    let dir = 1;
    let failureCount = 0;
    let iter = 1;

    while (failureCount < 2) {
      if ((xNext >= 0 && xNext < gameGlobals.gameMap.width) || (yNext >= 0 && yNext < gameGlobals.gameMap.height)) {
        for (let i = 0; i < iter; i++) {
          this.processXY(gameGlobals, xNext, y + i * dir);
          this.processXY(gameGlobals, x + i * dir, yNext);
        }
        this.processXY(gameGlobals, xNext, yNext);
        failureCount = 0;
      } else {
        failureCount++;
      }

      dir = -dir;
      x = xNext;
      xNext = startPos.x + dir * Math.ceil(iter/2) + (dir === 1 ? 1 : 0);
      y = yNext;
      yNext = startPos.y + dir * Math.ceil(iter/2) + (dir === 1 ? 1 : 0);
      iter++;
    }

    return this;
  }

  public getNextResource(type: number): ResourceClump {
    return this.resourceClumps[type].pop();
  }

  public getNextBuildSpace(gameGlobals: GameGlobals): Position {
    for (let i = this.cityPlans.length - 1; i >= 0; i--) {
      const nextPos = this.cityPlans[i];
      const cell = gameGlobals.gameMap.getCell(nextPos.x, nextPos.y);
      if (!cell.hasResource() && !cell.citytile) {
        return this.cityPlans.splice(i, 1)[0];
      }
    }

    return null;
  }

  private processXY(gameGlobals: GameGlobals, x: number, y: number): void {
    if (x < 0 || x >= gameGlobals.gameMap.width || y < 0 || y >= gameGlobals.gameMap.height) return;

    const position = new Position(x, y);

    this.cityPlans.unshift(position);

    const cell = gameGlobals.gameMap.getCell(x, y);
    if (cell?.hasResource()) {
      this.resourceClumps[ResourceTypeToIdx[cell.resource.type]]
        .unshift(new ResourceClump(cell.resource, position));
    }
  }
}
