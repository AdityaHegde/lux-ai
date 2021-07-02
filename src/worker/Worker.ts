import {Unit} from "../lux/Unit";
import {GameGlobals} from "../GameGlobals";
import {WorkerAction} from "./actions/WorkerAction";
import {CollectResource} from "./actions/CollectResource";
import {BuildCities} from "./actions/BuildCities";
import {DepositResource} from "./actions/DepositResource";
import {BUILD_RESOURCE, ENERGY_RESOURCE} from "../Planner";

export class Worker {
  public worker: Unit;
  public actions: Array<WorkerAction>;
  public actionIdx = 0;

  public constructor(worker: Unit, actions: Array<WorkerAction>) {
    this.worker = worker;
    this.actions = actions;
  }

  public work(gameGlobals: GameGlobals): void {
    if (!this.worker.canAct()) return;

    // console.error(`${this.worker.id} ${this.worker.getCargoSpaceLeft()} (${this.actionIdx})`);
    if (this.actions[this.actionIdx].act(this, gameGlobals)) return;

    this.actionIdx = (this.actionIdx + 1) % this.actions.length;
  }

  public static getBuilder(worker: Unit): Worker {
    return new Worker(worker, [
      new CollectResource(BUILD_RESOURCE), new BuildCities(),
    ]);
  }

  public static getSupplier(worker: Unit): Worker {
    return new Worker(worker, [
      new CollectResource(BUILD_RESOURCE), new DepositResource(),
    ]);
  }
}
