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
  StoneFloor: {
    sprite: Sprites.StoneFloor,
    walkable: true,
    transparent: true,
    color: "#242321",
  },
  StoneWall: {
    sprite: Sprites.StoneWall,
    walkable: false,
    transparent: false,
    color: "#383734",
  },
  StoneWallTop: {
    sprite: Sprites.StoneWallTop,
    walkable: false,
    transparent: false,
    color: "#383734",
  },
  FloorBlood: {
    sprite: Sprites.Floor + 10,
    walkable: true,
    transparent: true,
    color: "#241f1d",
  },
  WallBlood: {
    sprite: Sprites.Wall + 10,
    walkable: false,
    transparent: false,
    color: "#3e3635",
  },
};

type Plugin = {
  pre?(src: string): string;
  post?(grid: Grid<Tile>);
  [key: string]: any;
};

let AutoTiling: Plugin = {
  rules: [
    (tile, neighbours) => {
      if (tile.type === Tiles.WallTop && neighbours.below.type === Tiles.Floor) {
        tile.type = Tiles.Wall;
      }
    }
  ],

  post(map) {
    for (let [x, y, tile] of map) {
      let neighbours = {
        above: map.get(x, y - 1) || Tiles.Nothing,
        below: map.get(x, y + 1) || Tiles.Nothing,
        left: map.get(x - 1, y) || Tiles.Nothing,
        right: map.get(x + 1, y) || Tiles.Nothing,
      };

      for (let rule of this.rules) {
        rule(tile, neighbours);
      }
    }
  }
};

export class MapParser {
  static plugins: Plugin[] = [
    AutoTiling,
  ];

  static parse(src: string, legend: Legend): Grid<Tile> {
    for (let plugin of this.plugins) {
      if (plugin.pre) {
        src = plugin.pre(src);
      }
    }

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
        map.set(x, y, { type, visible: true });
      }
    }

    for (let plugin of this.plugins) {
      if (plugin.post) {
        plugin.post(map);
      }
    }

    return map;
  }
};
