import { Sprites } from "./sprites";

const BLACK = "#111";
const WHITE = "#fff";
const BROWN = "#735c28";
const RED = "#8f212e";
const SHADOW = "rgba(0, 0, 0, 0.5)";
const GREY = "#595652";

const HUMAN = "@";
const DOOR_OPEN = "+";
const DOOR_CLOSED = "/";

export let AsciiMappings: {
  [K in Sprites]: [string, string, string?]
} = {
  [Sprites.None]: [" ", BLACK],
  [Sprites.Floor]: [".", "#241f1c"],
  [Sprites.Wall]: ["#", "#403535"],
  [Sprites.WallTop]: ["#", "#403535"],
  [Sprites.Dark]: [" ", "transparent", SHADOW],
  [Sprites.Player]: [HUMAN, WHITE],
  [Sprites.Priest]: [HUMAN, "yellow"],
  [Sprites.Rat]: ["r", "grey"],
  [Sprites.Ghost]: ["g", "rgba(255, 255, 255, 0.4)"],
  [Sprites.Torch]: ['"', "orange"],
  [Sprites.Barrel]: [":", BROWN],
  [Sprites.SmashedBarrel]: [".", BROWN],
  [Sprites.Door]: [DOOR_CLOSED, BROWN],
  [Sprites.DoorOpen]: [DOOR_OPEN, BROWN],
  [Sprites.SignPost]: ["?", "green"],
  [Sprites.Well]: ["W", RED, "#403535"],
  [Sprites.Portal]: [DOOR_OPEN, "purple"],
  [Sprites.FlaskEmpty]: ["&", "#eee"],
  [Sprites.FlaskBlood]: ["&", RED],
  [Sprites.Cursor]: ["X", WHITE],
  [Sprites.TileGrey]: [" ", GREY],
  [Sprites.TileSelected]: ["_", "#eee"],
  [Sprites.TileActive]: ["_", WHITE],
  [Sprites.TileBlood100]: ["O", RED],
  [Sprites.TileBlood75]: ["o", RED],
  [Sprites.TileBlood50]: ["o", RED],
  [Sprites.TileBlood25]: [".", RED],
  [Sprites.Number0]: ["0", GREY],
  [Sprites.Number1]: ["1", WHITE],
  [Sprites.Number2]: ["2", WHITE],
  [Sprites.Number3]: ["3", WHITE],
  [Sprites.Number4]: ["4", WHITE],
  [Sprites.Number5]: ["5", WHITE],
  [Sprites.Number6]: ["6", WHITE],
  [Sprites.Number7]: ["7", WHITE],
  [Sprites.Number8]: ["8", WHITE],
  [Sprites.Number9]: ["9", WHITE],
  [Sprites.Missing]: ["X", "white", "red"],
};
