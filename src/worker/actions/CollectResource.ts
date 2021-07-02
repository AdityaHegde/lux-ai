import {WorkerAction} from "./WorkerAction";
import {ResourceClump} from "../../ResourceClump";
import {GameGlobals} from "../../GameGlobals";
import {GAME_CONSTANTS} from "../../lux/game_constants";
import {Worker} from "../Worker";

export class CollectResource extends WorkerAction {
  public resource: ResourceClump;
  public resourceType: number;

  public constructor(resourceType: number) {
    super();
    this.resourceType = resourceType;
  }

  public act(worker: Worker, gameGlobals: GameGlobals): boolean {
    if (worker.worker.getCargoSpaceLeft() <= 0) return false;

    console.error(`[CollectResource] ${worker.worker.id} ${worker.worker.getCargoSpaceLeft()}`);

    if (this.resource && !this.resource.isValid(gameGlobals.gameMap)) {
      this.resource = null;
    }
    if (!this.resource) {
      this.resource = gameGlobals.planner.getNextResource(this.resourceType);
    }

    const dir = worker.worker.pos.directionTo(this.resource.rallyPoint);
    if (dir !== GAME_CONSTANTS.DIRECTIONS.CENTER) {
      gameGlobals.actions.push(worker.worker.move(dir));
    }

    return true;
  }
}
