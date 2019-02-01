import { Handler } from "./engine";
import { Dungeon } from "./dungeon";
import * as Events from "./events";
import config from "./config";

const ROOM_WIDTH = 11;
const ROOM_HEIGHT = 11;
const MAP_SCALE = 2;

export class MinimapRenderer extends Handler {
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");
  dungeon: Dungeon;

  DungeonLoadEvent(event: Events.DungeonLoadEvent) {
    this.dungeon = event.dungeon;
    this.canvas.width = this.dungeon.width * ROOM_WIDTH * MAP_SCALE;
    this.canvas.height = this.dungeon.height * ROOM_HEIGHT * MAP_SCALE;
  }

  StartEvent() {
    this.render();
  }

  TurnEvent() {
    this.render();
  }

  render() {
    let { ctx } = this;

    ctx.save();
    ctx.scale(MAP_SCALE, MAP_SCALE);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let x = 0; x < this.dungeon.width; x++) {
      for (let y = 0; y < this.dungeon.height; y++) {
        let room = this.dungeon.getRoom(x, y);
        if (room == null) continue;

        ctx.save();
        ctx.translate(x * 11, y * 11);

        for (let i = 0; i < room.tiles.width; i++) {
          for (let j = 0; j < room.tiles.height; j++) {
            let tile = room.tiles.get(i, j);

            ctx.fillStyle = tile.type.color;
            ctx.fillRect(i, j, 1, 1);
          }
        }

        ctx.restore();
      }
    }

    ctx.restore();
  }
}
