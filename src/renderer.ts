import { Game, Entity, Handler } from "./engine";
import { Sprite, Animation, Position, FX, Layer } from "./components";
import { Sprites } from "./sprites";

const SHEET_COLUMNS = 10;
const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;
const TILE_WIDTH = 48;
const TILE_HEIGHT = 48;
const ANIMATION_TICK = 1000;
const RESOLUTION = window.devicePixelRatio;

const VIEWPORT_WIDTH = 11;
const VIEWPORT_HEIGHT = 11;

export class Renderer extends Handler {
  sprites = new Image();
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");
  running = true;

  constructor() {
    super();
    this.sprites.src = require("../assets/sprites.png");
    this.canvas.width = VIEWPORT_WIDTH * TILE_WIDTH * RESOLUTION;
    this.canvas.height = VIEWPORT_HEIGHT * TILE_HEIGHT * RESOLUTION;
    this.canvas.style.width = `${VIEWPORT_WIDTH * TILE_WIDTH}px`;
    this.canvas.style.height = `${VIEWPORT_HEIGHT * TILE_HEIGHT}px`;
    this.ctx.scale(RESOLUTION, RESOLUTION);
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.font = "32px MicroStyle";
  }

  get width() { return this.canvas.width; };
  get height() { return this.canvas.height; };

  StartEvent() {
    this.loop();
    setInterval(this.animate, 500);
  }

  PauseEvent() {
    this.running = !this.running;
  }

  animate = () => {
    for (let entity of this.game.findEntities(Animation)) {
      entity.map(Animation, animation => animation.step());
    }
  }

  loop = () => {
    requestAnimationFrame(this.loop);

    if (this.running) {
      this.render(this.game);
    }

    for (let entity of this.game.findEntities(FX)) {
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
      if (tile.seen) {
        this.renderSprite(tile.type.sprite, x, y);
      }
    }
  }

  renderLight(game: Game) {
    for (let [x, y, tile] of game.tiles) {
      if (tile.seen && tile.light < 0.5) {
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
    let entities = game.findEntities(Position);

    // TODO: Don't need this every frame, only when entities are added
    // (or moved across layers).
    entities.sort(this.sortByDepth);

    for (let entity of entities) {
      let pos = entity.get(Position);
      let sprite = entity.get(Sprite);
      let animation = entity.get(Animation);
      let fx = entity.get(FX);
      let tile = game.getTile(pos.x, pos.y);

      if (tile.light <= 0) {
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
      sx * SPRITE_WIDTH, sy * SPRITE_HEIGHT,
      SPRITE_WIDTH, SPRITE_HEIGHT,
      x * TILE_WIDTH, y * TILE_HEIGHT,
      TILE_WIDTH, TILE_HEIGHT,
    );
  }
}
