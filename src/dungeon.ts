// Bitmap for describing room exit configuration
enum Exits {
  North = 0b1000,
  South = 0b0100,
  East = 0b0010,
  West = 0b0001,
}

// TODO:
// Start with completely simplistic generation, just throw a random grid of
// rooms together, without caring whether they actually link properly. Can
// worry about the generation details later, once the connecting is working
// properly from a gameplay perspective.
//
// Need to create a big list of room templates, but reserve some for instance
// encounters (e.g. shouldn't be able to spawn boss room by accident on the
// first floor of the dungeon).
//
// Generation pseudocode
// =====================
//
// Start by picking a random template with at least one exit
// Place it into the dungeon at a random location
// Push room onto a stack
//
// While there are rooms on the stack
//   Pop current room from stack
//     For each exit in the current room
//       Pick a valid room to connect it
//       Do the new room's exits match on all sides
//       Place the new room and push onto stack
//     Does current configuration meet constraints?
//       Yes -> Block/lock all open exits
//       No  -> Continue
//     Does current configuration break rules?
//       Yes -> Start over
