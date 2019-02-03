import PRNG from "prng";
import { Grid } from "./utils";
import { Template, Dungeon } from "./dungeon";
import { NORTH, SOUTH, EAST, WEST, move, opposite } from "./directions";
import { depthFirstWalk } from "./graph";

export type Rule = (node: Node, map: Grid<Node>) => number;

export type GeneratorConfig = {
  seed: number;
  width: number;
  height: number;
  maxIterations: number;
}

export class Node {
  constructor(
    public x: number,
    public y: number,
    public template: Template
  ) {}

  hasExit(direction: number) {
    return (this.template.exits & direction) > 0;
  }
}

let rules: { [id: string]: Rule } = {
  connectivity(node, map) {
    let score = 0;

    for (let direction of [NORTH, EAST, SOUTH, WEST]) {
      let [x, y] = move(direction, node.x, node.y);
      let neighbour = map.get(x, y);
      let isEdge = map.isOutside(x, y);
      let hasExit = node.hasExit(direction);
      let hasEntrance = neighbour && neighbour.hasExit(opposite(direction));

      if (
        (hasExit && hasEntrance) ||
        (hasExit && !neighbour && !isEdge) ||
        (!hasExit && !hasEntrance)
      ) {
        score += 1;
      } else {
        score -= 100;
      }
    }

    return score;
  },
  density(node, map) {
    let score = 0;

    for (let x = node.x - 1; x <= node.x + 1; x++) {
      for (let y = node.y - 1; y <= node.y + 1; y++) {
        if (map.get(x, y)) {
          score -= 2;
        }
      }
    }

    return score;
  }
};

export class Generator {
  static defaults: GeneratorConfig = {
    seed: 0,
    width: 10,
    height: 10,
    maxIterations: 100,
  };

  public map: Grid<Node>;
  public config: GeneratorConfig;
  private stack: Node[] = [];
  private rng: PRNG;
  private templates: Template[];
  private rules: Rule[] = [
    rules.connectivity,
    rules.density,
  ];

  constructor(config: Partial<GeneratorConfig>, templates: Template[]) {
    this.config = { ...Generator.defaults, ...config };
    this.templates = templates;
    this.map = new Grid<Node>(config.width, config.height);
    this.rng = new PRNG(config.seed);
  }

  random(n: number): number {
    return this.rng.rand(n - 1);
  }

  score(node: Node): number {
    let total = 0;

    for (let rule of this.rules) {
      total += rule(node, this.map);
    }

    return total;
  }

  create(type: Template["type"], x: number, y: number): Node | undefined {
    let candidates: Node[] = [];

    for (let template of this.templates) {
      if (template.type === type) {
        let node = new Node(x, y, template);

        if (this.score(node) >= 0) {
          candidates.push(node);
        }
      }
    }

    return candidates[this.random(candidates.length)];
  }

  commit(node: Node) {
    this.stack.push(node);
    this.map.set(node.x, node.y, node);
  }

  connect(node: Node) {
    for (let direction of [NORTH, EAST, WEST, SOUTH]) {
      let [x, y] = move(direction, node.x, node.y);

      if (this.map.isOutside(x, y)) continue;
      if (this.map.get(x, y)) continue;

      if (node.hasExit(direction)) {
        let neighbour = this.create("connector", x, y);
        if (neighbour) this.commit(neighbour);
      }
    }
  }

  generate(): Grid<Node>  {
    let startX = 1 + this.random(this.map.width - 2);
    let startY = 1 + this.random(this.map.height - 2);
    let start = this.create("start", startX, startY);
    let iterations = 0;

    if (start === undefined) {
      throw new Error(`Could not find a suitable start node`);
    }

    this.commit(start);

    while (this.stack.length > 0) {
      let node = this.stack.pop();
      this.connect(node);
      if (iterations++ > 1000) break;
    }

    return this.map;
  }
}

export class GeneratorViewer {
  canvas = document.createElement("canvas");
  ctx = this.canvas.getContext("2d");

  constructor() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.right = "0";
    this.canvas.style.bottom = "0";
    this.canvas.style.background = "#111";

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "8px TinyUnicode";

    document.body.appendChild(this.canvas);
  }

  draw(gen: Generator) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(4, 4);

    let { legend } = require("./templates");

    for (const [x, y, node] of gen.map) {
      if (node == null) continue;

      let room = Dungeon.roomFromTemplate(node.template, legend);
      this.ctx.fillStyle = "white";

      for (let [i, j, tile] of room.tiles) {
        if (tile == null) continue;

        if (!tile.type.transparent) {
          this.ctx.fillRect(x * 11 + i, y * 11 + j, 1, 1);
        }
      }

      this.ctx.fillStyle = "blue";
      this.ctx.fillText(`${x},${y}`, x * 11 + 5.5, y * 11 + 5.5);
      this.ctx.fillStyle = "red";
      this.ctx.fillText(`${node.template.id}`, x * 11 + 3, y * 11 + 3);
    }

    this.ctx.restore();
  }
}
