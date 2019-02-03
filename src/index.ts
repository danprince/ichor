import { Game, Entity } from "./engine";
import { Sprites } from "./sprites";
import { Dungeon } from "./dungeon";
import { Generator, GeneratorViewer } from "./generator";
import { Templates, legend } from "./templates";
import { Handlers, Events, Components, Scripts } from "./registry";
import * as DOM from "./dom";
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
//game.addHandler(new Handlers.VisionHandler);
game.addHandler(new Handlers.CombatHandler);
game.addHandler(new Handlers.DamageHandler);
game.addHandler(new Handlers.DestructionHandler);
game.addHandler(new Handlers.MessagingHandler);
game.addHandler(new Handlers.DoorHandler);
game.addHandler(new Handlers.EnergyHandler);
game.addHandler(new Handlers.AIHandler);
game.addHandler(new Handlers.TurnHandler);

game.addHandler(new DOM.InputHandler);
game.addHandler(new DOM.UIHandler);

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

let viewer = new GeneratorViewer();

window.onload = window.onkeydown = () => {
  //let generator = new Generator({
  //  seed: Math.random() * 100,
  //  width: 10,
  //  height: 10,
  //  rooms: 20,
  //  maxRetries: 10,
  //  maxIterations: 100,
  //  density: -9,
  //}, Templates);

  let generator = new Generator({
    seed: Math.random() * 10000,
    width: 10,
    height: 10,
  }, Templates);

  let draft = generator.generate();
  let dungeon = new Dungeon(draft.width, draft.height);

  viewer.draw(generator);

  for (let [x, y, node] of draft) {
    if (node) {
      let room = Dungeon.roomFromTemplate(node.template, legend);
      dungeon.setRoom(x, y, room);
    }
  }

  //game.post(new Events.DungeonLoadEvent(dungeon));
  //game.post(new Events.StartEvent);
};


if (config["debug.globals"]) {
  Object.assign(self, {
    game,
    player,
    Events,
    Handlers,
    Components,
  });
}
