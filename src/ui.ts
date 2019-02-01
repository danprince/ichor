import { Game, Entity, Event, Handler } from "./engine";
import { Dungeon } from "./dungeon";
import { ASCIIRenderer, SpriteRenderer, MinimapRenderer } from "./renderer";
import { Sprite, Animation, Position, Layer, Mobile } from "./components";
import { Sprites } from "./sprites";
import { requestAnimationLoop } from "./utils";
import * as Events from "./events";
import config from "./config";

// This should be the only file that interacts with the DOM!

const TILE_WIDTH = config["renderer.tileWidth"];
const TILE_HEIGHT = config["renderer.tileHeight"];
const VIEWPORT_COLUMNS = config["renderer.viewportColumns"];
const VIEWPORT_ROWS = config["renderer.viewportRows"];
const ANIMATION_SPEED = config["renderer.animationSpeed"];
const HAS_ANIMATIONS = config["renderer.animations"];
const FPS = config["renderer.FPS"];

let dom = {
  root: document.getElementById("root"),
  log: document.getElementById("log"),
  viewport: document.getElementById("viewport"),
  tip: document.getElementById("tip"),
  messages: document.getElementById("messages"),
  minimap: document.getElementById("minimap"),
  hud: document.getElementById("hud"),
};

function sortByEntityDepth(entityA: Entity, entityB: Entity): number {
  let layerA = entityA.get(Layer);
  let layerB = entityB.get(Layer);
  return (layerA && layerA.index || 0) - (layerB && layerB.index || 0);
}

export class UIHandler extends Handler {
  renderer = new SpriteRenderer(VIEWPORT_COLUMNS, VIEWPORT_ROWS);
  inventoryRenderer = new SpriteRenderer(5, 1);
  minimapRenderer = new MinimapRenderer(240, 240);

  // Keep track of current dungeon for the minimap renderer.
  dungeon: Dungeon;

  // UI State
  selectedSlotIndex = 0;
  isSlotActive = false;
  bloodLevel = 0;

  attachToGame(game: Game) {
    super.attachToGame(game);
    game.addHandler(new InputHandler());
  }

  StartEvent(event: Events.StartEvent) {
    dom.viewport.append(this.renderer.canvas);
    dom.minimap.append(this.minimapRenderer.canvas);
    dom.hud.append(this.inventoryRenderer.canvas);

    requestAnimationLoop(this.render);

    if (HAS_ANIMATIONS) {
      requestAnimationLoop(this.animate, ANIMATION_SPEED);
    }

    this.minimapRenderer.zoom(3);
    this.renderMinimap();
  }

  TurnEvent(event: Events.TurnEvent) {
    this.renderMinimap();
  }

  TipShowEvent(event: Events.TipShowEvent) {
    let element = dom.tip;
    let { x, y } = this.worldToScreen(event.x + 0.5, event.y + 1);
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.innerHTML = event.message;
    element.classList.remove("hide");
  }

  TipHideEvent(event: Events.TipHideEvent) {
    dom.tip.classList.add("hide");
  }

  MessageEvent(event: Events.MessageEvent) {
    let node = document.createElement("div");
    node.classList.add("message");
    node.setAttribute("data-channel", event.channel);
    node.innerHTML = event.text;
    dom.log.appendChild(node);
    dom.log.scrollTo(0, 0);
  }

  DungeonLoadEvent(event: Events.DungeonLoadEvent) {
    this.dungeon = event.dungeon;
  }

  screenToWorld(x: number, y: number) {
    return { x: x / TILE_WIDTH, y: y / TILE_HEIGHT };
  }

  worldToScreen(x: number, y: number) {
    return { x: x * TILE_WIDTH, y: y * TILE_HEIGHT };
  }

  animate = () => {
    for (let entity of this.game.findEntitiesWith(Animation)) {
      entity.map(Animation, animation => animation.step());
    }

    this.render();
  }

  render = () => {
    this.renderer.clear();
    this.renderTiles();
    this.renderEntities();
    this.renderLight();
    this.renderUI();
  }

  renderTiles() {
    for (let [x, y, tile] of this.game.tiles) {
      this.renderer.draw(tile.type.sprite, x, y);
    }
  }

  renderEntities() {
    let entities = this.game.findEntitiesWith(Position);

    // TODO: Don't need this every frame, only when entities are added
    // (or moved across layers).
    entities.sort(sortByEntityDepth);

    for (let entity of entities) {
      let pos = entity.get(Position);
      let sprite = entity.get(Sprite);
      let animation = entity.get(Animation);
      let mobile = entity.has(Mobile);
      let tile = this.game.getTile(pos.x, pos.y);

      // Don't render mobile entities if they are out of sight
      if (tile && tile.visible === false && mobile) {
        continue;
      }

      if (sprite == null && animation == null) {
        continue;
      }

      let spriteId = animation ? animation.currentSprite() : sprite.id;
      this.renderer.draw(spriteId, pos.x, pos.y);
    }
  }

  renderLight() {
    for (let [x, y, tile] of this.game.tiles) {
      if (tile.visible === false) {
        this.renderer.draw(Sprites.Dark, x, y);
      }
    }
  }

  renderUI() {
    let renderer = this.inventoryRenderer;
    renderer.draw(Sprites.TileBlood25, 0, 0);
    renderer.draw(Sprites.Number4, 0, 0);
    renderer.draw(Sprites.TileGrey, 2, 0);
    renderer.draw(Sprites.TileGrey, 3, 0);
    renderer.draw(Sprites.TileGrey, 4, 0);
    renderer.draw(Sprites.TileSelected, 2, 0);
    renderer.draw(Sprites.FlaskBlood, 2, 0);
  }

  renderMinimap() {
    this.minimapRenderer.clear();

    // Because rooms can technically be different widths we just have
    // to make a guess at them for now.
    const ROOM_WIDTH = VIEWPORT_COLUMNS;
    const ROOM_HEIGHT = VIEWPORT_ROWS;

    for (let x = 0; x < this.dungeon.width; x++) {
      for (let y = 0; y < this.dungeon.height; y++) {
        let room = this.dungeon.getRoom(x, y);
        if (room == null) continue;

        for (let i = 0; i < room.tiles.width; i++) {
          for (let j = 0; j < room.tiles.height; j++) {
            let tile = room.tiles.get(i, j);

            this.minimapRenderer.draw(
              x * ROOM_WIDTH + i,
              y * ROOM_HEIGHT + j,
              tile.type.color,
            );
          }
        }
      }
    }
  }
}

enum Directions {
  None = 0b0000,
  North = 0b1000,
  East = 0b0100,
  South = 0b0010,
  West = 0b0001,
  NorthEast = Directions.North | Directions.East,
  NorthWest = Directions.North | Directions.West,
  SouthEast = Directions.South | Directions.East,
  SouthWest = Directions.South | Directions.West,
}

export class InputHandler extends Handler {
  priority = 100;

  hasDiagonalLock = false;
  diagonalDirection: number;

  StartEvent(event: Events.StartEvent) {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  isMappedTo(key: string, name: string) {
    let mappings = config[`controls.${name}`];
    return mappings && mappings.includes(key);
  }

  // Lots of complexity for something that doesn't even feel that great.
  // Not sure about keeping this. Maybe move out into a utility library
  // rather than have it cluttering up this file.
  onKeyDown = (event: KeyboardEvent) => {
    let { key } = event;

    if (this.hasDiagonalLock) {
      if (this.isMappedTo(key, "North")) {
        this.diagonalDirection |= Directions.North;
      } if (this.isMappedTo(key, "South")) {
        this.diagonalDirection |= Directions.South;
      } if (this.isMappedTo(key, "East")) {
        this.diagonalDirection |= Directions.East;
      } if (this.isMappedTo(key, "West")) {
        this.diagonalDirection |= Directions.West;
      }

      let direction = this.diagonalDirection;
      this.diagonalDirection = Directions.None;

      switch (direction) {
        case Directions.NorthWest:
          return this.game.post(new Events.MoveNorthWestEvent);
        case Directions.NorthEast:
          return this.game.post(new Events.MoveNorthEastEvent);
        case Directions.SouthEast:
          return this.game.post(new Events.MoveSouthEastEvent);
        case Directions.SouthWest:
          return this.game.post(new Events.MoveSouthWestEvent);
        default:
          this.diagonalDirection = direction;
      }

      return;
    }

    switch (true) {
      case this.isMappedTo(key, "North"):
        return this.game.post(new Events.MoveNorthEvent);
      case this.isMappedTo(key, "South"):
        return this.game.post(new Events.MoveSouthEvent);
      case this.isMappedTo(key, "East"):
        return this.game.post(new Events.MoveEastEvent);
      case this.isMappedTo(key, "West"):
        return this.game.post(new Events.MoveWestEvent);
      case this.isMappedTo(key, "NorthWest"):
        return this.game.post(new Events.MoveNorthWestEvent);
      case this.isMappedTo(key, "NorthEast"):
        return this.game.post(new Events.MoveNorthEastEvent);
      case this.isMappedTo(key, "SouthWest"):
        return this.game.post(new Events.MoveSouthWestEvent);
      case this.isMappedTo(key, "SouthEast"):
        return this.game.post(new Events.MoveSouthEastEvent);
      case this.isMappedTo(key, "DiagonalLock"):
        this.hasDiagonalLock = true;
        this.diagonalDirection = Directions.None;
        break;
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    let { key } = event;

    switch (true) {
      case this.isMappedTo(key, "DiagonalLock"):
        this.hasDiagonalLock = false;
        this.diagonalDirection = Directions.None;
        break;
    }
  }
}
