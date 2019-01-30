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

export let Cursor: Script = {
  GridHoverEvent(self, event, game) {
    let x = Math.floor(event.x);
    let y = Math.floor(event.y);
    let pos = self.get(Components.Position);

    // Cursor is already here, no need to update.
    if (pos.is(x, y)) {
      return;
    }

    game.post(new Events.CursorExitEvent(pos.x, pos.y));
    game.post(new Events.CursorEnterEvent(x, y));

    // Skip the usual entity movement stuff and update position directly.
    self.map(Components.Position, pos => {
      pos.x = x;
      pos.y = y;
    });
  },

  CursorExitEvent(self, event: Events.CursorExitEvent, game) {
    game.post(new Events.TipHideEvent);
  },

  CursorEnterEvent(self, event: Events.CursorEnterEvent, game) {
    let entity = game.findEntity(entity => (
      entity.has(Components.Position) &&
      entity.get(Components.Position).is(event.x, event.y)
    ));

    if (entity == null) {
      return;
    }

    let name = entity.get(Components.Name);

    if (name) {
      game.post(new Events.TipShowEvent(event.x, event.y, name.value));
    }
  },
};

export let Fountain: Script = {
  EntityTouchedEvent(self, event, game) {
    game.post(new Events.MessageEvent("You drink from the well"));
  }
};
