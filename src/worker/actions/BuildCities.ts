import {WorkerAction} from "./WorkerAction";
import {GameGlobals} from "../../GameGlobals";
import {Worker} from "../Worker";
import {Position} from "../../lux/Position";
import {GAME_CONSTANTS} from "../../lux/game_constants";

export class BuildCities extends WorkerAction {
  public cityPosition: Position;

  public act(worker: Worker, gameGlobals: GameGlobals): boolean {
    if (worker.worker.getCargoSpaceLeft() > 0) return false;

    console.error(`[BuildCities] ${worker.worker.id} ${worker.worker.getCargoSpaceLeft()}`);

    if (!this.cityPosition) {
      this.cityPosition = gameGlobals.planner.getNextBuildSpace(gameGlobals);
    }

    const dir = worker.worker.pos.directionTo(this.cityPosition);

    if (dir === GAME_CONSTANTS.DIRECTIONS.CENTER) {
      if (worker.worker.canBuild(gameGlobals.gameMap)) {
        console.error(`City at ${this.cityPosition.x},${this.cityPosition.y}`);
        gameGlobals.actions.push(worker.worker.buildCity());
        this.cityPosition = null;
        return false;
      }
    } else {
      gameGlobals.actions.push(worker.worker.move(dir));
    }

    return true;
  }
}
