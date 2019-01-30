import { Position } from "./components";
import { Entity } from "./engine";

export let position = (x: number, y: number) => (entity: Entity) => {
  return entity.has(Position) && entity.get(Position).is(x, y);
};
