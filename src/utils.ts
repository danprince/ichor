let id = 0;

export function uid() {
  return id++;
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export class PriorityQueue<T> {
  items: T[] = [];

  constructor(private compare: (a: T, b: T) => number) {

  }

  add(item: T) {
    this.items.push(item);
    this.items.sort(this.compare);
  }

  remove(item: T) {
    this.items = this.items.filter(other => other !== item);
  }

  [Symbol.iterator]() {
    return this.items.values();
  }
}
