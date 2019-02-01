import PRNG from "prng";
import { Entity, Game, Handler } from "./engine";
import { Tile, TileMap, Legend } from "./tiles";
import { Grid } from "./utils";

export enum Exits {
  None = 0b0000,
  North = 0b1000,
  South = 0b0100,
  East = 0b0010,
  West = 0b0001,
  All = 0b1111,
}

export type Template = {
  type: "start" | "connector" | "end",
  exits: number,
  preset: boolean,
  tiles: string,
  spawn?: [number, number],
  setup?(game: Game): void,
  onEnter?(game: Game): void,
  onExit?(game: Game): void,
};

export type Room = {
  loaded: boolean;
  template: Template;
  tiles: Grid<Tile>;
  entities: Entity[];
};

export class Dungeon {
  static roomFromTemplate(template: Template, legend: Legend): Room {
    return {
      loaded: false,
      template: template,
      tiles: TileMap.load(template.tiles, legend),
      entities: [],
    };
  }

  constructor(
    public width: number,
    public height: number,
  ) {
    this.rooms = new Array(width * height);
  }

  // TODO: Use Grid<Room>
  rooms: Room[] = [];

  getRoom(x: number, y: number): Room {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      return this.rooms[x + y * this.width];
    }
  }

  setRoom(x: number, y: number, room: Room) {
    if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
      this.rooms[x + y * this.width] = room;
    }
  }

  getNonEmptyRooms(): Room[] {
    return this.rooms.filter(room => room);
  }

  countRooms(): number {
    return this.getNonEmptyRooms().length;
  }

  getStartPosition() {
    let index = this.rooms.findIndex(room => {
      return room && room.template.type === "start";
    });

    let x = index % this.width;
    let y = Math.floor(index / this.width);

    return { x, y };
  }
}

export type DungeonGeneratorConfig = {
  seed: number,
  width: number,
  height: number,
  rooms: number,
  retries?: number,
};

type Placement = {
  x: number,
  y: number,
  room: Room,
};

// Made a really good start with this dungeon generator. Think it can be
// improved by a rewrite with a less sleepy brain.
//
// Pretty sure it could be made more elegant with generators. Better systems
// for scoring, rejecting and getting more rooms would be better.
//
// Would be better to move lots of the local variables in generate up to
// being class properties, so that functions like tryToPlace can become
// methods.
//
// Really think about doing something where a generator can just yield
// rooms one by one (in rng order) and have a separate piece that checks
// their score, then accept/reject them.
//
// Maybe build separate set of tools for viewing generated dungeons?

export class DungeonGenerator {
  rng: PRNG;

  static MAX_ITERATIONS = 100;

  constructor(private config: DungeonGeneratorConfig) {
    this.rng = new PRNG(config.seed);
  }

  generate(templates: Template[], legend: Legend): Dungeon {
    let dungeon = new Dungeon(this.config.width, this.config.height);

    let starts = templates.filter(template => template.type === "start");
    let ends = templates.filter(template => template.type === "end");
    let connectors = templates.filter(template => template.type === "connector");

    let start = starts[this.rng.rand(starts.length - 1)];
    let startX = this.rng.rand(this.config.width - 1);
    let startY = this.rng.rand(this.config.height - 1);
    let room = Dungeon.roomFromTemplate(start, legend);

    let stack: Placement[] = [];

    stack.push({ x: startX, y: startY, room });

    let tryToPlace = (x: number, y: number, exit: number) => {

      // Can't place a room outside the map
      if (x < 0 || y < 0 || x >= dungeon.width || y >= dungeon.height) {
        return;
      }

      // Can't place a room over an existing room
      if (dungeon.getRoom(x, y)) {
        return;
      }

      let matches = connectors.filter(template => template.exits & exit);
      let template = matches[this.rng.rand(matches.length - 1)];

      // There is no template that will fit here
      if (template == null) {
        return;
      }

      let roomToNorth = dungeon.getRoom(x, y - 1);
      let roomToSouth = dungeon.getRoom(x, y + 1);
      let roomToEast = dungeon.getRoom(x + 1, y);
      let roomToWest = dungeon.getRoom(x - 1, y);

      if (
        // Check whether the exits line up with the rooms around it

        // TODO: Also need to check the inverse is true!
        // Don't block rooms with open exits, if possible.
        ((template.exits & Exits.North) && roomToNorth && !(roomToNorth.template.exits & Exits.South)) ||
        ((template.exits & Exits.South) && roomToSouth && !(roomToSouth.template.exits & Exits.North)) ||
        ((template.exits & Exits.West) && roomToWest && !(roomToWest.template.exits & Exits.East)) ||
        ((template.exits & Exits.East) && roomToEast && !(roomToEast.template.exits & Exits.West))
      ) {
        return;
      }

      let room = Dungeon.roomFromTemplate(template, legend);
      stack.push({ x, y, room });
    }

    let iterations = 0;

    while (stack.length > 0) {
      let { x, y, room } = stack.pop();

      dungeon.setRoom(x, y, room);

      if (room.template.exits & Exits.East) {
        tryToPlace(x + 1, y, Exits.West);
      }

      if (room.template.exits & Exits.West) {
        tryToPlace(x - 1, y, Exits.East);
      }

      if (room.template.exits & Exits.North) {
        tryToPlace(x, y - 1, Exits.South);
      }

      if (room.template.exits & Exits.South) {
        tryToPlace(x, y + 1, Exits.North);
      }

      iterations += 1;

      if (iterations > DungeonGenerator.MAX_ITERATIONS) {
        break;
      }

      if (dungeon.countRooms() >= this.config.rooms) {
        break;
      }
    }

    // TODO: Try to place end-room

    return dungeon;
  }
}
