import {CityTile} from "../lux/CityTile";
import {City} from "../lux/City";
import {Position} from "../lux/Position";

export function getNearestCityTile(city: City, pos: Position): {closestDist: number, closestCityTile: CityTile} {
  let closestDist = 999999;
  let closestCityTile: CityTile = null;

  city?.citytiles.forEach((cityTile) => {
    const dist = cityTile.pos.distanceTo(pos);
    if (dist < closestDist) {
      closestCityTile = cityTile;
      closestDist = dist;
    }
  });

  return {closestDist, closestCityTile};
}
