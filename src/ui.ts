import { Game, Event, Handler } from "./engine";
import { Renderer } from "./renderer";
import { MinimapRenderer } from "./minimap";
import * as Events from "./events";
import config from "./config";

let dom = {
  root: document.getElementById("root"),
  log: document.getElementById("log"),
  viewport: document.getElementById("viewport"),
  tip: document.getElementById("tip"),
  messages: document.getElementById("messages"),
  minimap: document.getElementById("minimap"),
};

export class UIHandler extends Handler {
  // Goal is to drive the renderer from this handler and have the renderer
  // only care about sprites (no actual game stuff).
  renderer = new Renderer();
  minimap = new MinimapRenderer();

  // TODO: Remove when renderer and minimap are no longer handling events
  attachToGame(game: Game) {
    super.attachToGame(game);
    this.renderer.attachToGame(game);
    this.minimap.attachToGame(game);
    game.addHandler(new InputHandler());
  }

  // TODO: Remove when renderer and minimap are no longer handling events
  Event(event: Event) {
    let key = event.constructor.name;
    if (this.renderer[key]) this.renderer[key](event);
    if (this.minimap[key]) this.minimap[key](event);
  }

  StartEvent(event: Events.StartEvent) {
    dom.viewport.append(this.renderer.canvas);
    dom.minimap.append(this.minimap.canvas);
  }

  TipShowEvent(event: Events.TipShowEvent) {

  }

  TipHideEvent(event: Events.TipHideEvent) {

  }

  MessageEvent(event: Events.MessageEvent) {
    let node = document.createElement("div");
    node.classList.add("message");
    node.setAttribute("data-channel", event.channel);
    node.innerHTML = event.text;
    dom.log.appendChild(node);
    dom.log.scrollTo(0, 0);
  }
}

export class InputHandler extends Handler {
  priority = 100;

  constructor() {
    super();
  }

  StartEvent(event: Events.StartEvent) {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  isMappedTo(key: string, name: string) {
    let mappings = config[`controls.${name}`];
    return mappings && mappings.includes(key);
  }

  onKeyDown = (event: KeyboardEvent) => {
    let { key } = event;

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
      case this.isMappedTo(key, "DirectionLock"):
        // TODO: Mark the direction as being locked to diagonals
        // Then whilst the key is down wait for pairs of events
        // that can be combined to form a diagonal movement.
        break;
    }
  }

  onKeyUp = (event: KeyboardEvent) => {
    let { key } = event;

    switch (true) {
      case this.isMappedTo(key, "DirectionLock"):
        break;
    }
  }
}
