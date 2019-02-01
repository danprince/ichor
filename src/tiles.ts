import { Sprites } from "./sprites";
import { Grid } from "./utils";

export type Tile = {
  type: TileType,
  visible: boolean,
};

export type TileType = {
  sprite: number,
  walkable: boolean,
  transparent: boolean,
  color: string,
};

export type Legend = {
  [char: string]: TileType,
};

export let Tiles = {
  Nothing: {
    sprite: Sprites.None,
    walkable: false,
    transparent: true,
    color: "transparent",
  },
  Floor: {
    sprite: Sprites.Floor,
    walkable: true,
    transparent: true,
    color: "#241f1d",
  },
  Wall: {
    sprite: Sprites.Wall,
    walkable: false,
    transparent: false,
    color: "#3e3635",
  },
  WallTop: {
    sprite: Sprites.WallTop,
    walkable: false,
    transparent: false,
    color: "#3e3635",
  },
};

// Deprecated in favour of utils/Grid
export class TileMap {
  static load(src: string, legend: Legend): Grid<Tile> {
    let lines = src
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");

    let height = lines.length;
    let width = lines[0].length;
    let map = new Grid<Tile>(width, height);

    for (let y = 0; y < height; y++) {
      let line = lines[y];

      for (let x = 0; x < width; x++) {
        let char = line[x];
        let type = legend[char] || Tiles.Nothing;

        map.set(x, y, {
          type,
          visible: false,
        });
      }
    }

    return map;
  }
}
