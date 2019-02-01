import { Entity } from "./engine";
import { Sprites } from "./sprites";
import * as Components from "./components";
import * as Scripts from "./scripts";

export let Priest = (x, y) => Entity.with(
  new Components.Position(x, y),
  new Components.Animation(Sprites.Priest, 2),
  new Components.Blocking,
  new Components.Blood(10),
  new Components.Energy(1),
  new Components.Name("Denizen"),
  new Components.Mobile,
  new Components.Brain,
  new Components.Energy(0.3),
  new Components.Attackable,
);

export let Ghost = (x, y) => Entity.with(
  new Components.Position(x, y),
  new Components.Animation(Sprites.Ghost, 2),
  new Components.Brain,
  new Components.Blood(10),
  new Components.Name("Ghost"),
  new Components.Mobile,
  new Components.Brain,
  new Components.Energy(1),
);

export let Rat = (x, y) => Entity.with(
  new Components.Position(x, y),
  new Components.Animation(Sprites.Rat, 2),
  new Components.Brain,
  new Components.Blocking,
  new Components.Blood(2),
  new Components.Name("Rat"),
  new Components.Mobile,
  new Components.Brain,
  new Components.Energy(0.5),
  new Components.Attackable,
);

export let Well = (x, y) => Entity.with(
  new Components.Position(3, 1),
  new Components.Animation(Sprites.Well, 3),
  new Components.Blocking,
  new Components.Blood(2),
  new Components.Name("Blood Well"),
  new Components.Scripts(
    Scripts.Fountain
  ),
);

export let SignPost = (x, y, message) => Entity.with(
  new Components.Position(x, y),
  new Components.Sprite(Sprites.SignPost),
  new Components.Message(message, "help"),
);

export let Door = (x, y) => Entity.with(
  new Components.Blocking,
  new Components.Position(x, y),
  new Components.Sprite(Sprites.Door),
  new Components.Openable(Sprites.DoorOpen),
);

export let Torch = (x, y) => Entity.with(
  new Components.Position(x, y),
  new Components.Animation(Sprites.Torch, 2),
);

export let Barrel = (x, y) => Entity.with(
  new Components.Position(x, y),
  new Components.Sprite(Sprites.Barrel),
  new Components.Breakable(Sprites.SmashedBarrel),
  new Components.Layer(-1),
  new Components.Blocking,
);

export let Portal = (x, y) => Entity.with(
  new Components.Position(x, y),
  new Components.Animation(Sprites.Portal, 2),
  new Components.Blocking,
);
