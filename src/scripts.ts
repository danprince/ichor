import { Script } from "./engine";
import * as Components from "./components";
import * as Events from "./events";

export let Player: Script = {
  MoveNorthEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x, y - 1));
  },

  MoveSouthEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x, y + 1));
  },

  MoveEastEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x + 1, y));
  },

  MoveWestEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x - 1, y));
  },

  MoveNorthWestEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x - 1, y - 1));
  },

  MoveNorthEastEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x + 1, y - 1));
  },

  MoveSouthWestEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x - 1, y + 1));
  },

  MoveSouthEastEvent(player, event, game) {
    let { x, y } = player.get(Components.Position);
    game.post(new Events.EntityMoveEvent(player, x + 1, y + 1));
  },
}

export let Fountain: Script = {
  EntityTouchedEvent(self, event, game) {
    console.log("player touched me");
  }
};
