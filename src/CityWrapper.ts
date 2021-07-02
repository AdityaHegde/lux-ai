import {GameGlobals} from "./GameGlobals";

export class CityWrapper {
  public run(gameGlobals: GameGlobals): void {
    if (!gameGlobals.city) return;

    let buildSpace = gameGlobals.city?.citytiles.length - gameGlobals.workerMap.size;
    gameGlobals.city?.citytiles.forEach((cityTile) => {
      if (!cityTile.canAct()) return;
      if (buildSpace > 0) {
        gameGlobals.actions.push(cityTile.buildWorker());
        buildSpace++;
      } else {
        gameGlobals.actions.push(cityTile.research());
      }
    });
  }
}
