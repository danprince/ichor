import { Game, Entity } from "./engine";
import { Renderer } from "./renderer";
import { Sprites } from "./sprites";
import { Tiles, TileMap } from "./tiles";
import * as Handlers from "./handlers";
import * as Events from "./events";
import * as Components from "./components";
import * as Scripts from "./scripts";
import controls from "./controls";
import config from "./config";

console.log(
  `%cIchor v${process.env.VERSION} [${process.env.NODE_ENV}]`,
  `font-weight: bold`
);

let game = new Game();
let renderer = new Renderer();

let dom = {
  root: document.getElementById("root"),
  log: document.getElementById("log"),
  viewport: document.getElementById("viewport"),
  tip: document.getElementById("tip"),
};

dom.viewport.append(renderer.canvas);

game.addHandler(new Handlers.ControlsHandler(controls, renderer.canvas));
game.addHandler(new Handlers.ScriptingHandler);
game.addHandler(new Handlers.VisionHandler);
game.addHandler(new Handlers.MovementHandler);
game.addHandler(new Handlers.CombatHandler);
game.addHandler(new Handlers.DamageHandler);
game.addHandler(new Handlers.DestructionHandler);
game.addHandler(new Handlers.MessagingHandler(dom.log));
game.addHandler(new Handlers.DoorHandler);
game.addHandler(new Handlers.EnergyHandler);
game.addHandler(new Handlers.AIHandler);
game.addHandler(new Handlers.TurnHandler);
game.addHandler(renderer);

let player = Entity.with(
  new Components.Position(2, 1),
  new Components.Animation(Sprites.Player, 2),
  new Components.Blocking,
  new Components.Blood(10),
  new Components.Layer(1),
  new Components.Scripts(Scripts.Player),
  new Components.Name("You"),
  new Components.Attackable,
);

player.addTag("player");

let cursor = Entity.with(
  new Components.Position(-1, -1),
  //new Components.Sprite(Sprites.Cursor),
  new Components.Scripts(Scripts.Cursor),
);

cursor.addTag("cursor");

game.addEntity(player);
game.addEntity(cursor);

game.addEntity(Entity.with(
  new Components.Position(2, 1),
  new Components.Animation(Sprites.Priest, 2),
  new Components.Blocking,
  new Components.Blood(10),
  new Components.Energy(1),
  new Components.Name("Denizen"),
  new Components.Mobile,
  new Components.Brain,
  new Components.Energy(0.3),
  new Components.Attackable,
));

game.addEntity(Entity.with(
  new Components.Position(8, 8),
  new Components.Animation(Sprites.Ghost, 2),
  new Components.Brain,
  new Components.Blood(10),
  new Components.Name("Ghost"),
  new Components.Mobile,
  new Components.Brain,
  new Components.Energy(1),
));

game.addEntity(Entity.with(
  new Components.Position(2, 5),
  new Components.Animation(Sprites.Rat, 2),
  new Components.Brain,
  new Components.Blocking,
  new Components.Blood(2),
  new Components.Name("Rat"),
  new Components.Mobile,
  new Components.Brain,
  new Components.Energy(0.5),
  new Components.Attackable,
));

game.addEntity(Entity.with(
  new Components.Position(3, 1),
  new Components.Animation(Sprites.Well, 3),
  new Components.Blocking,
  new Components.Blood(2),
  new Components.Name("Blood Well"),
  new Components.Scripts(
    Scripts.Fountain
  ),
));

game.addEntity(Entity.with(
  new Components.Position(5, 7),
  new Components.Sprite(Sprites.SignPost),
  new Components.Message(`Press <kbd>k</kbd> to move North.`, "help"),
));

game.addEntity(Entity.with(
  new Components.Position(5, 6),
  new Components.Sprite(Sprites.SignPost),
  new Components.Message(`Press <kbd>y</kbd> to move North-West.`, "help"),
));

game.addEntity(Entity.with(
  new Components.Position(4, 5),
  new Components.Sprite(Sprites.SignPost),
  new Components.Message(`Press <kbd>u</kbd> to move North-East.`, "help"),
));

game.addEntity(Entity.with(
  new Components.Position(5, 4),
  new Components.Sprite(Sprites.SignPost),
  new Components.Message(`Press <kbd>n</kbd> to move South-East.`, "help"),
));

game.addEntity(Entity.with(
  new Components.Position(6, 5),
  new Components.Sprite(Sprites.SignPost),
  new Components.Message(`Press <kbd>b</kbd> to move South-West.`, "help"),
));

game.addEntity(Entity.with(
  new Components.Blocking,
  new Components.Position(5, 10),
  new Components.Sprite(Sprites.Door),
  new Components.Openable(Sprites.DoorOpen),
));

game.addEntity(Entity.with(
  new Components.Blocking,
  new Components.Position(0, 5),
  new Components.Sprite(Sprites.Door),
  new Components.Openable(Sprites.DoorOpen),
));

game.addEntity(Entity.with(
  new Components.Position(4, 6),
  new Components.Animation(Sprites.Torch, 2),
));

game.addEntity(Entity.with(
  new Components.Position(6, 6),
  new Components.Animation(Sprites.Torch, 2),
));

game.addEntity(Entity.with(
  new Components.Position(4, 1),
  new Components.Sprite(Sprites.Barrel),
  new Components.Breakable(Sprites.SmashedBarrel),
  new Components.Layer(-1),
  new Components.Blocking,
));

game.addEntity(Entity.with(
  new Components.Position(5, 0),
  new Components.Sprite(Sprites.Barrel),
  new Components.Breakable(Sprites.SmashedBarrel),
  new Components.Layer(-1),
  new Components.Blocking,
));

game.addEntity(Entity.with(
  new Components.Position(6, 1),
  new Components.Sprite(Sprites.Barrel),
  new Components.Breakable(Sprites.SmashedBarrel),
  new Components.Layer(-1),
  new Components.Blocking,
));

let tiles = `
  ##===.===##
  #=.......=#
  #.........#
  #..##=##..#
  =..#=.=#..=
  ...#.=.#...
  #..==.==..#
  #.........#
  #...=.=...#
  ##.......##
  =====.=====
`;

let legend = {
  "=": Tiles.Wall,
  "#": Tiles.WallTop,
  ".": Tiles.Floor,
};

game.tiles = TileMap.load(tiles, legend);
game.post(new Events.StartEvent);

if (config["debug.globals"]) {
  (window as any).game = game;
}
