import {Agent, GameState} from "./lux/Agent";
import {GameGlobals} from "./GameGlobals";
import {Worker} from "./worker/Worker";

const agent = new Agent();

let builderCount = 0;
const maxBuilders = 2;
let supplierCount = 0;

agent.run((gameState: GameState): Array<string> => {
  const gameGlobals = GameGlobals.tick(gameState);

  if (!gameGlobals) return [];

  const aliveUnits = new Set<string>();

  gameGlobals.player.units.forEach((unit) => {
    aliveUnits.add(unit.id);
    if (unit.isWorker()) {
      if (!gameGlobals.workerMap.has(unit.id)) {
        // console.error(`${unit.id} ${builderCount} ${supplierCount}`);
        if (builderCount <= supplierCount && builderCount < maxBuilders) {
          gameGlobals.workerMap.set(unit.id, Worker.getBuilder(unit));
          builderCount++;
        } else {
          gameGlobals.workerMap.set(unit.id, Worker.getSupplier(unit));
          supplierCount++;
        }
      } else {
        // do game objects update automatically?
        gameGlobals.workerMap.get(unit.id).worker = unit;
      }
    }
  });

  gameGlobals.workerMap.forEach((worker) => {
    if (!aliveUnits.has(worker.worker.id)) {
      gameGlobals.workerMap.delete(worker.worker.id);
    }

    worker.work(gameGlobals);
  });

  gameGlobals.cityWrapper.run(gameGlobals);

  return gameGlobals.actions;
});
