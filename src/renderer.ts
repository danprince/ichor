import { Sprites } from "./sprites";
import { AsciiMappings } from "./ascii";
import config from "./config";

const SHEET_COLUMNS = config["spritesheet.columns"];
const SHEET_ROWS = config["spritesheet.rows"];
const SPRITE_WIDTH = config["spritesheet.spriteWidth"];
const SPRITE_HEIGHT = config["spritesheet.spriteHeight"];
const TILE_WIDTH = config["renderer.tileWidth"];
const TILE_HEIGHT = config["renderer.tileHeight"];

const RESOLUTION: number = (
  config["renderer.resolution"] || window.devicePixelRatio
);

const SPRITE_URL: string = (
  config["spritesheet.url"] || require("../assets/sprites.png")
);

export class SpriteRenderer {
  sprites = new Image();
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");

  get width() {
    return this.canvas.width;
  };

  get height() {
    return this.canvas.height;
  };

  constructor(columns: number, rows: number) {
    this.sprites.src = SPRITE_URL;

    // Rescale canvas for retina screens / higher resolution
    this.canvas.width = columns * TILE_WIDTH * RESOLUTION;
    this.canvas.height = rows * TILE_HEIGHT * RESOLUTION;
    this.canvas.style.width = `${columns * TILE_WIDTH}px`;
    this.canvas.style.height = `${rows * TILE_HEIGHT}px`;
    this.ctx.scale(RESOLUTION, RESOLUTION);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.font = "32px TinyUnicode";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  draw(id: Sprites, x: number, y: number) {
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

export class ASCIIRenderer {
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");

  get width() {
    return this.canvas.width;
  };

  get height() {
    return this.canvas.height;
  };

  constructor(columns: number, rows: number) {
    // Rescale canvas for retina screens / higher resolution
    this.canvas.width = columns * TILE_WIDTH * RESOLUTION;
    this.canvas.height = rows * TILE_HEIGHT * RESOLUTION;
    this.canvas.style.width = `${columns * TILE_WIDTH}px`;
    this.canvas.style.height = `${rows * TILE_HEIGHT}px`;
    this.ctx.scale(RESOLUTION, RESOLUTION);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.font = "24px mononoki";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  draw(id: Sprites, x: number, y: number) {
    let [char, fg, bg="transparent"] =
      (AsciiMappings[id] || AsciiMappings[Sprites.Missing]);

    if (bg !== "transparent") {
      this.ctx.fillStyle = bg;
      this.ctx.fillRect(
        x * TILE_WIDTH,
        y * TILE_HEIGHT,
        TILE_WIDTH,
        TILE_HEIGHT
      );
    }

    if (fg !== "transparent") {
      this.ctx.fillStyle = fg;
      this.ctx.fillText(
        char,
        (x + 0.5) * TILE_WIDTH,
        (y + 0.5) * TILE_HEIGHT
      );
    }
  }
}

export class MinimapRenderer {
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");

  constructor(public width: number, public height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(x: number, y: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1);
  }

  zoom(level: number) {
    this.ctx.scale(level, level);
  }
}
