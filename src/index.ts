import { Game, Entity } from "./engine";
import { Renderer } from "./renderer";
import { Sprites } from "./sprites";
import { Tiles, TileMap } from "./tiles";
import * as Handlers from "./handlers";
import * as Events from "./events";
import * as Components from "./components";
import * as Scripts from "./scripts";
import controls from "./controls";

console.log(`Version ${process.env.VERSION}`);

let game = new Game();
let renderer = new Renderer();

let dom = {
  root: document.getElementById("root"),
  message: document.getElementById("message"),
  viewport: document.getElementById("viewport"),
};

game.register({
  events: Events,
  handlers: Handlers,
  components: Components,
});

game.addHandler(new Handlers.ControlsHandler(controls, dom.root));
game.addHandler(new Handlers.ScriptingHandler);
game.addHandler(new Handlers.LightingHandler);
game.addHandler(new Handlers.MovementHandler);
game.addHandler(new Handlers.CombatHandler);
game.addHandler(new Handlers.DestructionHandler);
game.addHandler(new Handlers.DoorHandler);
game.addHandler(new Handlers.TurnHandler);
game.addHandler(renderer);

game.addEntity(Entity.with(
  new Components.Position(2, 1),
  new Components.Animation(Sprites.Player, 2),
  new Components.Blocking,
  new Components.Blood(10),
  new Components.LightSource(5),
  new Components.Layer(1),
  new Components.Scripts(
    Scripts.Player
  ),
));

game.addEntity(Entity.with(
  new Components.Position(2, 1),
  new Components.Animation(Sprites.Priest, 2),
  new Components.Brain,
  new Components.Blocking,
  new Components.Blood(10),
));

game.addEntity(Entity.with(
  new Components.Position(2, 8),
  new Components.Animation(Sprites.Brute, 2),
  new Components.Brain,
  new Components.Blocking,
  new Components.Blood(10),
));

game.addEntity(Entity.with(
  new Components.Position(8, 8),
  new Components.Animation(Sprites.Ghost, 2),
  new Components.Brain,
  new Components.Blood(10),
));

game.addEntity(Entity.with(
  new Components.Position(2, 5),
  new Components.Animation(Sprites.Rat, 2),
  new Components.Brain,
  new Components.Blocking,
  new Components.Blood(2),
));

game.addEntity(Entity.with(
  new Components.Position(3, 1),
  new Components.Animation(Sprites.Well, 3),
  new Components.Blocking,
  new Components.Blood(2),
  new Components.Scripts(
    Scripts.Fountain
  ),
));

game.addEntity(Entity.with(
  new Components.Position(3, 1),
  new Components.Sprite(Sprites.Cursor),
));

game.addEntity(Entity.with(
  new Components.Position(6, 7),
  new Components.Sprite(Sprites.SignPost),
  new Components.Layer(-1),
));

game.addEntity(Entity.with(
  new Components.Blocking,
  new Components.Position(5, 10),
  new Components.Sprite(Sprites.Door),
  new Components.Openable(Sprites.DoorOpen),
));

game.addEntity(Entity.with(
  new Components.Position(5, 6),
  new Components.Animation(Sprites.Torch, 2),
  new Components.LightSource(1),
));

game.addEntity(Entity.with(
  new Components.Position(7, 6),
  new Components.Animation(Sprites.Torch, 2),
  new Components.LightSource(1),
));

game.addEntity(Entity.with(
  new Components.Position(4, 1),
  new Components.Sprite(Sprites.Barrel),
  new Components.Breakable(Sprites.SmashedBarrel),
  new Components.Layer(-1),
  new Components.Blocking,
));

game.addEntity(Entity.with(
  new Components.Position(5, 1),
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
  ##=======##
  #=.......=#
  #.........#
  #.........#
  #....=....#
  #.....=...#
  #....=.=..#
  #.........#
  #....=.=..#
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

dom.viewport.append(renderer.canvas);
