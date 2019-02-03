export function depthFirstWalk<T>(start: T, visit: (node: T) => T[]) {
  let stack = [start];

  while (stack.length > 0) {
    let node = stack.pop();
    let nodes = visit(node);
    stack.push(...nodes);
  }
}

export function breadthFirstWalk<T>(start: T, visit: (node: T) => T[]) {
  let queue = [start];

  while (queue.length > 0) {
    let node = queue.shift();
    let nodes = visit(node);
    queue.push(...nodes);
  }
}
