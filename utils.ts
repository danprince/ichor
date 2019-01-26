let id = 0;

export function uid() {
  return id++;
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

