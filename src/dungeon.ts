import PRNG from "prng";
import { Entity, Game, Handler } from "./engine";
import { Tile, Legend, MapParser } from "./tiles";
import { Grid } from "./utils";
import { NORTH, EAST, SOUTH, WEST } from "./directions";
import * as Directions from "./directions";
import { depthFirstWalk } from "./graph";

export type Template = {
  id?: number,
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
      tiles: MapParser.parse(template.tiles, legend),
      entities: [],
    };
  }

  rooms: Grid<Room>;

  constructor(
    public width: number,
    public height: number,
  ) {
    this.rooms = new Grid<Room>(width, height);
  }

  getRoom(x: number, y: number): Room {
    return this.rooms.get(x, y);
  }

  setRoom(x: number, y: number, room: Room) {
    return this.rooms.set(x, y, room);
  }

  getNonEmptyRooms(): Room[] {
    return this.rooms.toArray().filter(room => room);
  }

  countRooms(): number {
    return this.getNonEmptyRooms().length;
  }

  getStartPosition() {
    for (let [x, y, room] of this.rooms) {
      if (room && room.template.type === "start") {
        return { x, y };
      }
    }
  }
}
