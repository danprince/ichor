import * as test from "tape";

import {
  NORTH,
  EAST,
  SOUTH,
  WEST,
  NORTH_WEST,
  SOUTH_WEST,
  NORTH_EAST,
  SOUTH_EAST,
  rotate,
  opposite,
  move,
} from "./directions";

test("rotating directions", t => {
  t.is(rotate(NORTH), EAST, "north -> east");
  t.is(rotate(WEST), NORTH, "west -> north");
  t.is(rotate(SOUTH_WEST), NORTH_WEST, "south west -> north west");
  t.end();
});

test("opposite directions", t => {
  t.is(opposite(NORTH), SOUTH, "north -> south");
  t.is(opposite(WEST), EAST, "west -> east");
  t.is(opposite(EAST), WEST, "east -> west");
  t.is(opposite(SOUTH), NORTH, "south -> south");
  t.is(opposite(SOUTH_WEST), NORTH_EAST, "south west -> north east");
  t.end();
});

test("move directions", t => {
  t.same(move(NORTH, 0, 0), [0, -1], "move north");
  t.same(move(SOUTH, 0, 0), [0, 1], "move south");
  t.same(move(WEST, 0, 0), [-1, 0], "move west");
  t.same(move(EAST, 0, 0), [1, 0], "move east");
  t.end();
});
