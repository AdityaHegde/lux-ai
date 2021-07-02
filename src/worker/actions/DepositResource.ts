import {WorkerAction} from "./WorkerAction";
import {GameGlobals} from "../../GameGlobals";
import {getNearestCityTile} from "../../utils/getNearestCityTile";
import {Worker} from "../Worker";

export class DepositResource extends WorkerAction {
  public act(worker: Worker, gameGlobals: GameGlobals): boolean {
    if (worker.worker.getCargoSpaceLeft() > 0) return false;

    console.error(`[DepositResource] ${worker.worker.id} ${worker.worker.getCargoSpaceLeft()}`);

    const {closestCityTile} = getNearestCityTile(gameGlobals.city, worker.worker.pos);
    if (!closestCityTile) return false;

    const dir = worker.worker.pos.directionTo(closestCityTile.pos);
    gameGlobals.actions.push(worker.worker.move(dir));

    return true;
  }
}
