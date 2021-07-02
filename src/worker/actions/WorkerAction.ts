import {GameGlobals} from "../../GameGlobals";
import {Worker} from "../Worker";

export class WorkerAction {
  public act(worker: Worker, gameGlobals: GameGlobals): boolean {
    return false;
  }
}
