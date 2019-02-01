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

export let Templates: Template[] = [{
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}, {
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
}];

export default Templates;
