import { Game, Entity } from "./engine";
import { Renderer } from "./renderer";
import { Sprites } from "./sprites";
import { Tiles, TileMap } from "./tiles";
import { Dungeon, DungeonGenerator } from "./dungeon";
import * as Templates from "./templates";
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
  messages: document.getElementById("messages"),
};

dom.viewport.append(renderer.canvas);

game.addHandler(new Handlers.ControlsHandler(controls, renderer.canvas));
game.addHandler(new Handlers.ScriptingHandler);
game.addHandler(new Handlers.DungeonHandler);
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
  new Components.Position(1, 9),
  new Components.Animation(Sprites.Player, 2),
  new Components.Blocking,
  new Components.Blood(10),
  new Components.Layer(1),
  new Components.Scripts(Scripts.Player),
  new Components.Name("You"),
  new Components.Attackable,
);

player.addTag("player");
game.addEntity(player);

//let cursor = Entity.with(
//  new Components.Position(-1, -1),
//  new Components.Sprite(Sprites.Cursor),
//  new Components.Scripts(Scripts.Cursor),
//);
//
//cursor.addTag("cursor");
//game.addEntity(cursor);


let tutorial = new Dungeon(3, 3);

tutorial.setRoom(0, 0, Dungeon.roomFromTemplate(
  Templates.Tutorial1,
  Templates.legend,
));

tutorial.setRoom(1, 0, Dungeon.roomFromTemplate(
  Templates.Tutorial2,
  Templates.legend,
));

tutorial.setRoom(1, 1, Dungeon.roomFromTemplate(
  Templates.Tutorial3,
  Templates.legend,
));

let generator = new DungeonGenerator({
  seed: Math.random() * 123456,
  width: 30,
  height: 10,
  rooms: 80,
});

let dungeon = generator.generate([
  Templates.Entrance,
  Templates.FourRooms,
  Templates.Passage,
  Templates.Passage2,
  Templates.OneRoom,
  Templates.Corner,
  Templates.Corner2,
  Templates.Cells,
], Templates.legend);

console.log(dungeon);

game.post(new Events.DungeonLoadEvent(dungeon));
game.post(new Events.StartEvent);

if (config["debug.globals"]) {
  (window as any).game = game;
}

// TODO: Move this out into a minimap renderer.
let canvas = document.createElement("canvas");

canvas.width = dungeon.width * 11 * 2;
canvas.height = dungeon.height * 11 * 2;

let ctx = canvas.getContext("2d");

ctx.scale(2, 2);
ctx.fillStyle = "#111";
ctx.fillRect(0, 0, dungeon.width, dungeon.height);

for (let x = 0; x < dungeon.width; x++) {
  for (let y = 0; y < dungeon.height; y++) {
    let room = dungeon.getRoom(x, y);
    if (room == null) continue;

    ctx.save();
    ctx.translate(x * 11, y * 11);
    ctx.fillStyle = "#241f1d";
    ctx.fillRect(0, 0, room.tiles.width, room.tiles.height);

    for (let i = 0; i < room.tiles.width; i++) {
      for (let j = 0; j < room.tiles.height; j++) {
        let tile = room.tiles.at(i, j);

        if (!tile.type.transparent) {
          ctx.fillStyle = "#3e3635";
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }

    ctx.restore();
  }
}

document.body.appendChild(canvas);
