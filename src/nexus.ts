import { Dungeon, Template, Exits } from "./dungeon";
import { legend } from "./templates";
import * as Events from "./events";
import * as Objects from "./objects";

let Templates: { [id: string]: Template } = {
  Entrance: {
    type: "start",
    preset: true,
    spawn: [5, 9],
    exits: Exits.None,
    tiles: `
      ##=======##
      #=.......=#
      #.........#
      #.........#
      =.........=
      ...........
      #.........#
      #.........#
      #.........#
      ##.......##
      ===========
    `,
    setup(game) {
      game.post(new Events.MessageEvent(``));
      game.addEntity(Objects.Portal(5, 2));
    }
  },
  Tutorial1: {
    type: "start",
    preset: true,
    spawn: [1, 9],
    exits: Exits.East,
    tiles: `
      #=========#
      #.........#
      #.##=#===.#
      #.#=.=....#
      #.#.=.#====
      #.#=.=#....
      #.#...#...#
      #.#...#...#
      #.#...=...#
      #.#.......#
      ===========
    `,
    setup(game) {
      game.post(new Events.MessageEvent(`Press <kbd>k</kbd> to move North.`, "help"));
      game.addEntity(Objects.SignPost(1, 1, `Press <kbd>l</kbd> to move East.`));
      game.addEntity(Objects.SignPost(9, 1, `Press <kbd>j</kbd> to move South.`));
      game.addEntity(Objects.SignPost(9, 3, `Press <kbd>h</kbd> to move West.`));

      game.addEntity(Objects.SignPost(6, 3, `Press <kbd>b</kbd> to move South-West.`));
      game.addEntity(Objects.SignPost(5, 4, `Press <kbd>y</kbd> to move North-West.`));
      game.addEntity(Objects.SignPost(4, 3, `Press <kbd>b</kbd> to move South-West.`));
      game.addEntity(Objects.SignPost(3, 4, `Press <kbd>n</kbd> to move South-East.`));
      game.addEntity(Objects.SignPost(4, 5, `Press <kbd>u</kbd> to move North-East.`));

      game.addEntity(Objects.Door(6, 9));
      game.addEntity(Objects.Barrel(10, 5));
      game.addEntity(Objects.Barrel(9, 5));
      game.addEntity(Objects.Barrel(9, 6));
      game.addEntity(Objects.Barrel(8, 5));
      game.addEntity(Objects.Barrel(7, 5));
      game.addEntity(Objects.Barrel(7, 6));
      game.addEntity(Objects.SignPost(8, 6, `The exit is blocked. Try walking into the barrels to smash them.`));
    }
  },

  Tutorial2: {
    type: "connector",
    preset: true,
    exits: Exits.West | Exits.South,
    tiles: `
      ===========
      #.........#
      #.........#
      #.........#
      =.........#
      ..........#
      #.........#
      #.........#
      #.........#
      #.........#
      =====.=====
    `,
    setup(game) {
      game.post(new Events.MessageEvent(`You made it to room 2`));
    }
  },

  Tutorial3: {
    type: "end",
    preset: true,
    exits: Exits.North,
    tiles: `
      =====.=====
      #.........#
      #.........#
      #..====...#
      #......#..#
      #..====#..#
      #......=..#
      #..====...#
      #.........#
      #.........#
      ===========
    `,
    onEnter(game) {
      game.post(new Events.MessageEvent(`Enter room 3`));
    },
    onExit(game) {
      game.post(new Events.MessageEvent(`Exit room 3`));
    }
  },
};

let nexus = new Dungeon(3, 3);

nexus.setRoom(0, 0, Dungeon.roomFromTemplate(Templates.Entrance, legend));
nexus.setRoom(1, 0, Dungeon.roomFromTemplate(Templates.Tutorial1, legend));
nexus.setRoom(2, 0, Dungeon.roomFromTemplate(Templates.Tutorial2, legend));
nexus.setRoom(2, 1, Dungeon.roomFromTemplate(Templates.Tutorial3, legend));

export default nexus;
