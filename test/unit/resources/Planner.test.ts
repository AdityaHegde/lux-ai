import {DataProviderData, TestBase} from "../../utils/TestBase";
import {Position} from "../../../src/lux/Position";
import should from "should";
import {Planner} from "../../../src/Planner";

type PlannerData = [width: number, height: number, x: number, y: number];

@TestBase.Suite
export class PlannerTest extends TestBase {
  public plannerData(): DataProviderData<PlannerData> {
    return {
      subData: [
        PlannerTest.getCornerPoints(10, 10),
        PlannerTest.getCornerPoints(20, 10),
        PlannerTest.getCornerPoints(10, 20),
      ],
    };
  }

  @TestBase.Test("plannerData")
  public shouldCallGetCell(width: number, height: number, x: number, y: number): void {
    const gameGlobals = {
      gameMap: {
        width, height, getCell: this.sandbox.stub(),
      },
      city: {
        citytiles: [{ pos: new Position(x, y) }],
      }
    };
    new Planner().init(gameGlobals as any);
    should(gameGlobals.gameMap.getCell.callCount).be.eql(width *  height - 1);
  }

  private static getCornerPoints(width: number, height: number): DataProviderData<PlannerData> {
    return {
      title: `Width=${width} Height=${height}`,
      subData: [{
        args: [width, height, 2, 2],
      }, {
        args: [width, height, width - 2, height - 2],
      }, {
        args: [width, height, 2, height - 2],
      }, {
        args: [width, height, width - 2, 2],
      }],
    };
  }
}