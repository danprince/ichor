import { Game, Entity} from "./engine";
import { Tiles } from "./tiles";
import { Template } from "./dungeon";
import { NORTH, EAST, SOUTH, WEST } from "./directions";
import * as Events from "./events";
import * as Objects from "./objects";

export let legend = {
  "'": Tiles.Nothing,
  ".": Tiles.Floor,
  "=": Tiles.Wall,
  "#": Tiles.WallTop,
  ",": Tiles.StoneFloor,
  "-": Tiles.StoneWall,
  "%": Tiles.StoneWallTop,
};

export let Templates: Template[] = [{
  id: 0,
  type: "start",
  preset: false,
  exits: NORTH | EAST | WEST,
  spawn: [5, 9],
  tiles: `
    =====.=====
    #.........#
    #.........#
    #.........#
    #.........=
    ...........
    #.........#
    #.........#
    #..#...#..#
    #..#...#..#
    ===========
  `,
}, {
  id: 1,
  type: "connector",
  preset: false,
  exits: NORTH | EAST | WEST,
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
  id: 2,
  type: "connector",
  preset: false,
  exits: NORTH | EAST | SOUTH | WEST,
  tiles: `
    =====.=====
    #.........#
    #.........#
    #..#####..#
    =..#...#..#
    ...#...#...
    #..#...#..#
    #..##.##..#
    #.........#
    #.........#
    =====.=====
  `,
}, {
  id: 3,
  type: "connector",
  preset: false,
  exits: NORTH | SOUTH,
  tiles: `
    ''''#.#''''
    #####.#####
    #.........#
    #.........#
    #.........#
    #.........#
    #.........#
    #.........#
    #.........#
    #####.#####
    ''''#.#''''
  `,
}, {
  id: 4,
  type: "connector",
  preset: false,
  exits: EAST | WEST,
  tiles: `
    '#########'
    '#.......#'
    '#.......#'
    '#.......#'
    ##.......##
    ...........
    ##.......##
    '#.......#'
    '#.......#'
    '#.......#'
    '#########'
  `,
}, {
  id: 5,
  type: "connector",
  preset: false,
  exits: EAST | SOUTH,
  tiles: `
    '''''''''''
    '#########'
    '#.......#'
    '#.......#'
    '#.......##
    '#.........
    '#.......##
    '#.......#'
    '#.......#'
    '####.####'
    ''''=.=''''
  `,
}, {
  id: 6,
  type: "connector",
  preset: false,
  exits: WEST | SOUTH,
  tiles: `
    '''''''''''
    '#########'
    '#.......#'
    '#.......#'
    ##.......#'
    .........#'
    ##.......#'
    '#.......#'
    '#.......#'
    '####.####'
    ''''=.=''''
  `,
}, {
  id: 7,
  type: "connector",
  preset: false,
  exits: EAST | WEST,
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
}, {
  id: 8,
  type: "connector",
  preset: false,
  exits: EAST | NORTH,
  tiles: `
    ''''#.#''''
    '####.####'
    '#.......#'
    '#.......#'
    '#.......##
    '#.........
    '#.......##
    '#.......#'
    '#.......#'
    '#########'
    '''''''''''
  `,
}, {
  id: 9,
  type: "connector",
  preset: false,
  exits: WEST | NORTH,
  tiles: `
    ''''#.#''''
    '####.####'
    '#.......#'
    '#.......#'
    ##.......#'
    .........#'
    ##.......#'
    '#.......#'
    '#.......#'
    '#########'
    '''''''''''
  `,
}, {
  id: 10,
  type: "connector",
  preset: false,
  exits: EAST | WEST | NORTH,
  tiles: `
    ''''#.#''''
    '####.####'
    '#.......#'
    '#.......#'
    ##.......##
    ...........
    ##.......##
    '#.......#'
    '#.......#'
    '#.......#'
    '#########'
  `,
}];

export default Templates;
