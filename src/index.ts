import { Game, Entity } from "./engine";
import { Sprites } from "./sprites";
import { Dungeon, DungeonGenerator } from "./dungeon";
import { Templates, legend } from "./templates";
import { UIHandler, InputHandler } from "./ui";
import * as Handlers from "./handlers";
import * as Events from "./events";
import * as Components from "./components";
import * as Scripts from "./scripts";
import nexus from "./nexus";
import config from "./config";

console.log(
  `%cIchor v${process.env.VERSION} [${process.env.NODE_ENV}]`,
  `font-weight: bold`
);

let game = new Game();

game.addHandler(new Handlers.ScriptingHandler);
game.addHandler(new Handlers.DungeonHandler);
game.addHandler(new Handlers.MovementHandler);
game.addHandler(new Handlers.VisionHandler);
game.addHandler(new Handlers.CombatHandler);
game.addHandler(new Handlers.DamageHandler);
game.addHandler(new Handlers.DestructionHandler);
game.addHandler(new Handlers.MessagingHandler);
game.addHandler(new Handlers.DoorHandler);
game.addHandler(new Handlers.EnergyHandler);
game.addHandler(new Handlers.AIHandler);
game.addHandler(new Handlers.TurnHandler);
game.addHandler(new UIHandler);

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

let generator = new DungeonGenerator({
  seed: Math.random() * 123456,
  width: 10,
  height: 10,
  rooms: 80,
});

let dungeon = generator.generate(Templates, legend);

game.post(new Events.DungeonLoadEvent(nexus));
game.post(new Events.StartEvent);

if (config["debug.globals"]) {
  Object.assign(window, {
    game,
    player,
    Events,
    Handlers,
    Components,
  });
}
