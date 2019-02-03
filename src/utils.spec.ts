import * as test from "tape";
import { PriorityQueue } from "./utils";

test("priotity queue should sort inserted items", t => {
  let queue = new PriorityQueue<number>((a, b) => b - a);
  queue.add(1);
  queue.add(10);

  t.same(queue.items, [10, 1]);
  t.end();
});
