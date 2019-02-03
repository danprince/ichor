export const NORTH = 0b0001; // 1
export const EAST = 0b0010;  // 2
export const SOUTH = 0b0100; // 4
export const WEST = 0b1000;  // 8
export const NORTH_EAST = NORTH | EAST;
export const NORTH_WEST = NORTH | WEST;
export const SOUTH_EAST = SOUTH | EAST;
export const SOUTH_WEST = SOUTH | WEST;

export const NAMES = {
  [NORTH]: "north",
  [EAST]: "east",
  [WEST]: "west",
  [SOUTH]: "south",
  [NORTH_EAST]: "north_east",
  [NORTH_WEST]: "north_west",
  [SOUTH_EAST]: "south_east",
  [SOUTH_WEST]: "south_west",
};

export function rotate(direction: number): number {
  let rotated = 0;
  if (direction & NORTH) rotated |= EAST;
  if (direction & EAST) rotated |= SOUTH;
  if (direction & SOUTH) rotated |= WEST;
  if (direction & WEST) rotated |= NORTH;
  return rotated;
}

export function opposite(direction: number): number {
  let flipped = 0;
  if (direction & NORTH) flipped |= SOUTH;
  if (direction & EAST) flipped |= WEST;
  if (direction & SOUTH) flipped |= NORTH;
  if (direction & WEST) flipped |= EAST;
  return flipped;
}

export function move(direction: number, x: number, y: number) {
  if (direction & NORTH) y -= 1;
  if (direction & SOUTH) y += 1;
  if (direction & WEST) x -= 1;
  if (direction & EAST) x += 1;
  return [x, y];
}
