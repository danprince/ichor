import { Game, Entity, Handler } from "./engine";
import { Sprite, Animation, Position, FX, Layer, Mobile } from "./components";
import { Sprites } from "./sprites";
import { requestAnimationLoop } from "./utils";
import * as Events from "./events";
import config from "./config";

const VIEWPORT_WIDTH = config["viewport.width"];
const VIEWPORT_HEIGHT = config["viewport.height"];
const SHEET_COLUMNS = config["spritesheet.columns"];
const SHEET_ROWS = config["spritesheet.rows"];
const SPRITE_WIDTH = config["spritesheet.spriteWidth"];
const SPRITE_HEIGHT = config["spritesheet.spriteHeight"];
const TILE_WIDTH = config["renderer.tileWidth"];
const TILE_HEIGHT = config["renderer.tileHeight"];
const ANIMATION_SPEED = config["renderer.animationSpeed"];

const RESOLUTION: number = (
  config["renderer.resolution"] || window.devicePixelRatio
);

const SPRITE_URL: string = (
  config["spritesheet.url"] || require("../assets/sprites.png")
);

export class Renderer extends Handler {
  sprites = new Image();
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");
  running = true;

  constructor() {
    super();
    this.sprites.src = SPRITE_URL;
    this.canvas.width = VIEWPORT_WIDTH * TILE_WIDTH * RESOLUTION;
    this.canvas.height = VIEWPORT_HEIGHT * TILE_HEIGHT * RESOLUTION;
    this.canvas.style.width = `${VIEWPORT_WIDTH * TILE_WIDTH}px`;
    this.canvas.style.height = `${VIEWPORT_HEIGHT * TILE_HEIGHT}px`;
    this.ctx.scale(RESOLUTION, RESOLUTION);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.font = "32px TinyUnicode";
  }

  get width() { return this.canvas.width; };
  get height() { return this.canvas.height; };

  StartEvent() {
    requestAnimationLoop(this.loop);
    requestAnimationLoop(this.animate, ANIMATION_SPEED);
  }

  PauseEvent() {
    this.running = !this.running;
  }

  TipShowEvent(event: Events.TipShowEvent) {
    let element = document.getElementById("tip");
    let { x, y } = this.worldToScreen(event.x + 0.5, event.y + 1);
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.innerHTML = event.message;
    element.classList.remove("hide");
  }

  TipHideEvent(event: Events.TipHideEvent) {
    let element = document.getElementById("tip");
    element.classList.add("hide");
  }

  CanvasClickEvent(event: Events.CanvasClickEvent) {
    let { x, y } = this.screenToWorld(event.x, event.y);
    this.game.post(new Events.GridClickEvent(x, y));
  }

  CanvasHoverEvent(event: Events.CanvasHoverEvent) {
    let { x, y } = this.screenToWorld(event.x, event.y);
    this.game.post(new Events.GridHoverEvent(x, y));
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
  }

  loop = () => {
    if (this.running) {
      this.render(this.game);
    }

    for (let entity of this.game.findEntitiesWith(FX)) {
      if (entity.get(FX).hasFinished()) {
        this.game.removeEntity(entity);
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  render(game: Game) {
    this.clear();
    this.renderTiles(game);
    this.renderEntities(game);
    this.renderLight(game);
    this.renderUI();
  }

  renderUI() {
    this.ctx.save();
    this.renderSprite(Sprites.TileBlood25, 0, 0);
    this.renderSprite(Sprites.Number4, 0, 0);
    this.renderSprite(Sprites.TileGrey, 0, 1);
    this.renderSprite(Sprites.TileGrey, 0, 2);
    this.renderSprite(Sprites.TileGrey, 0, 3);
    this.renderSprite(Sprites.TileSelected, 0, 1);
    this.renderSprite(Sprites.FlaskBlood, 0, 1);
    this.ctx.restore();
  }

  renderTiles(game: Game) {
    for (let [x, y, tile] of game.tiles) {
      this.renderSprite(tile.type.sprite, x, y);
    }
  }

  renderLight(game: Game) {
    for (let [x, y, tile] of game.tiles) {
      if (tile.visible === false) {
        this.renderSprite(Sprites.Dark, x, y);
      }
    }
  }

  sortByDepth = (entityA: Entity, entityB: Entity) => {
    let layerA = entityA.get(Layer);
    let layerB = entityB.get(Layer);
    return (layerA && layerA.index || 0) - (layerB && layerB.index || 0);
  };

  renderEntities(game: Game) {
    let entities = game.findEntitiesWith(Position);

    // TODO: Don't need this every frame, only when entities are added
    // (or moved across layers).
    entities.sort(this.sortByDepth);

    for (let entity of entities) {
      let pos = entity.get(Position);
      let sprite = entity.get(Sprite);
      let animation = entity.get(Animation);
      let fx = entity.get(FX);
      let mobile = entity.has(Mobile);
      let tile = game.getTile(pos.x, pos.y);

      // Skip mobile entities on tiles out of sight
      if (tile.visible === false && mobile) {
        continue;
      }

      if (sprite == null && animation == null && fx == null) {
        continue;
      }

      this.ctx.save();

      this.ctx.translate(
        (pos.x + 0.5) * TILE_WIDTH,
        (pos.y + 0.5) * TILE_HEIGHT
      );

      if (fx) {
        this.ctx.globalAlpha = fx.opacity > 0 ? fx.opacity : 0;
        this.ctx.translate(fx.translate.x, fx.translate.y);
        this.ctx.scale(fx.scale, fx.scale);
        this.ctx.rotate(fx.rotate);
        fx.step();
      }

      let spriteId = animation ? animation.currentSprite() : sprite.id;

      this.renderSprite(spriteId, -0.5, -0.5);
      this.ctx.restore();
    }
  }

  renderSprite(id: Sprites, x: number, y: number) {
    let sx = id % SHEET_COLUMNS;
    let sy = Math.floor(id / SHEET_COLUMNS);

    this.ctx.drawImage(
      this.sprites,
      sx * SPRITE_WIDTH,
      sy * SPRITE_HEIGHT,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      x * TILE_WIDTH,
      y * TILE_HEIGHT,
      TILE_WIDTH,
      TILE_HEIGHT,
    );
  }
}
