import { Sprites } from "./sprites";
import * as ascii from "../ascii.json";
import config from "./config";

const SHEET_COLUMNS = config["spritesheet.columns"];
const SHEET_ROWS = config["spritesheet.rows"];
const SPRITE_WIDTH = config["spritesheet.spriteWidth"];
const SPRITE_HEIGHT = config["spritesheet.spriteHeight"];
const TILE_WIDTH = config["renderer.tileWidth"];
const TILE_HEIGHT = config["renderer.tileHeight"];
const ASCII_TILE_WIDTH = config["renderer.asciiTileWidth"];
const ASCII_TILE_HEIGHT = config["renderer.asciiTileHeight"];
const ASCII_FONT = config["renderer.asciiFont"];
const RENDERER_FONT = config["renderer.font"];

const RESOLUTION: number = (
  config["renderer.resolution"] || window.devicePixelRatio
);

const SPRITE_URL: string = (
  config["spritesheet.url"] || require("../assets/sprites.png")
);

export interface Renderer {
  canvas: HTMLCanvasElement;
  clear(): void;
  draw(sprite: Sprites, x: number, y: number): void;
}

export class SpriteRenderer implements Renderer {
  sprites = new Image();
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

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
    this.ctx.font = RENDERER_FONT;
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

export class AsciiRenderer implements Renderer {
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

  // [char, foreground, background?]
  mappings: { [name: string]: [string, string, string?] } = ascii as any;

  get width() {
    return this.canvas.width;
  };

  get height() {
    return this.canvas.height;
  };

  constructor(columns: number, rows: number) {
    // Rescale canvas for retina screens / higher resolution
    this.canvas.width = columns * ASCII_TILE_WIDTH * RESOLUTION;
    this.canvas.height = rows * ASCII_TILE_HEIGHT * RESOLUTION;
    this.canvas.style.width = `${columns * ASCII_TILE_WIDTH}px`;
    this.canvas.style.height = `${rows * ASCII_TILE_HEIGHT}px`;
    this.ctx.scale(RESOLUTION, RESOLUTION);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.font = ASCII_FONT;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  draw(id: Sprites, x: number, y: number) {
    let name = Sprites[id];

    let [char, fg, bg="transparent"] =
      this.mappings[name] || this.mappings["Missing"];

    if (bg !== "transparent") {
      this.ctx.fillStyle = bg;
      this.ctx.fillRect(
        x * ASCII_TILE_WIDTH,
        y * ASCII_TILE_HEIGHT,
        ASCII_TILE_WIDTH,
        ASCII_TILE_HEIGHT,
      );
    }

    if (fg !== "transparent") {
      this.ctx.fillStyle = fg;
      this.ctx.fillText(
        char,
        (x + 0.5) * ASCII_TILE_WIDTH,
        (y + 0.5) * ASCII_TILE_HEIGHT,
      );
    }
  }
}

export class MinimapRenderer {
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

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

  scale(level: number) {
    this.ctx.scale(level, level);
  }
}
