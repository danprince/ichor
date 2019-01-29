import { Sprites } from "./sprites";

export type Tile = {
  type: TileType,
  light: number,
  seen: boolean,
};

export type TileType = {
  sprite: number,
  walkable: boolean,
};

export type Legend = {
  [char: string]: TileType,
};

export let Tiles = {
  Nothing: {
    sprite: Sprites.None,
    walkable: false,
  },
  Floor: {
    sprite: Sprites.Floor,
    walkable: true,
  },
  Wall: {
    sprite: Sprites.Wall,
    walkable: false,
  },
  WallTop: {
    sprite: Sprites.WallTop,
    walkable: false,
  },
};

export const EMPTY_TILE: Tile = Object.freeze({
  light: 0,
  type: Tiles.Nothing,
  seen: false,
});

export class TileMap {
  tiles: Tile[];

  constructor(public width: number, public height: number) {
    this.tiles = [];
  }

  at(x: number, y: number): Tile {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return EMPTY_TILE;
    }

    return this.tiles[x + y * this.width] || EMPTY_TILE;
  }

  set(x: number, y: number, tile: Tile) {
    this.tiles[x + y * this.width] = tile;
  }

  *[Symbol.iterator]() {
    let cell = [];

    for (let x = 0; x < this.width; x++) {
      cell[0] = x;
      for (let y = 0; y < this.height; y++) {
        cell[1] = y;
        cell[2] = this.at(x, y);
        yield cell;
      }
    }
  }

  static load(src: string, legend: Legend): TileMap {
    let lines = src
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");

    let height = lines.length;
    let width = lines[0].length;
    let map = new TileMap(width, height);

    for (let y = 0; y < height; y++) {
      let line = lines[y];

      for (let x = 0; x < width; x++) {
        let char = line[x];
        let type = legend[char] || Tiles.Nothing;

        map.tiles[x + y * height] = {
          type,
          light: 0,
          seen: false,
        };
      }
    }

    return map;
  }
}
