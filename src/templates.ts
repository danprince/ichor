import { Game, Entity} from "./engine";
import { Tiles } from "./tiles";
import { Template, Exits } from "./dungeon";
import * as Events from "./events";
import * as Objects from "./objects";

export let legend = {
  "'": Tiles.Nothing,
  "=": Tiles.Wall,
  "#": Tiles.WallTop,
  ".": Tiles.Floor,
};

export let Tutorial1: Template = {
  type: "start",
  preset: true,
  spawn: [1, 9],
  exits: Exits.East,
  tiles: `
    ===========
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
};

export let Tutorial2: Template = {
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
    game.post(new Events.MessageEvent(`You made it to room 2`, "help"));
  }
};

export let Tutorial3: Template = {
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
    game.post(new Events.MessageEvent(`Enter room 3`, "help"));
  },
  onExit(game) {
    game.post(new Events.MessageEvent(`Exit room 3`, "help"));
  }
};

export let Entrance: Template = {
  type: "start",
  preset: false,
  exits: Exits.North | Exits.East | Exits.West,
  spawn: [5, 9],
  tiles: `
    =====.=====
    #.........#
    #.........#
    #.........#
    =.........=
    ...........
    #.........#
    #.........#
    #..#...#..#
    #..#...#..#
    ===========
  `,
};

export let OneRoom: Template = {
  type: "connector",
  preset: false,
  exits: Exits.All,
  tiles: `
    =====.=====
    #.........#
    #.........#
    #.........#
    =.........=
    ...........
    #.........#
    #.........#
    #.........#
    #.........#
    ===========
  `,
};

export let FourRooms: Template = {
  type: "connector",
  preset: false,
  exits: Exits.All,
  tiles: `
    =====.=====
    #...#.#...#
    #...#.#...#
    #...#.#...#
    ==.==.==.=#
    ...........
    #=.=#.#=.=#
    #...#.#...#
    #...#.#...#
    #...#.#...#
    =====.=====
  `,
};

export let Passage: Template = {
  type: "connector",
  preset: false,
  exits: Exits.North | Exits.South,
  tiles: `
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''#.#''''
    ''''=.=''''
  `,
};

export let Passage2: Template = {
  type: "connector",
  preset: false,
  exits: Exits.East | Exits.West,
  tiles: `
    '''''''''''
    '''''''''''
    '''''''''''
    '''''''''''
    ###########
    ...........
    ###########
    '''''''''''
    '''''''''''
    '''''''''''
    '''''''''''
  `,
};

export let Corner: Template = {
  type: "connector",
  preset: false,
  exits: Exits.East | Exits.South,
  tiles: `
    '''''''''''
    '''''''''''
    '''''''''''
    '''''''''''
    ''''''''###
    ''''''.#...
    '''''.#..##
    '''''#..#''
    ''''#..#'''
    ''''#..#'''
    ''''=.=''''
  `,
};

export let Corner2: Template = {
  type: "connector",
  preset: false,
  exits: Exits.East | Exits.South,
  tiles: `
    '''''''''''
    '''''''''''
    '''''''''''
    '''''''''''
    ####'''''''
    ....#''''''
    ##...#'''''
    ''##..#''''
    ''''#..#'''
    ''''#..#'''
    ''''=.=''''
  `,
};

export let Cells: Template = {
  type: "connector",
  preset: false,
  exits: Exits.East | Exits.West,
  tiles: `
    ###########
    #.#.#.#.#.#
    ###########
    #.........#
    #.........#
    ...........
    #.........#
    #.........#
    ###########
    #.#.#.#.#.#
    ###########
  `,
};
