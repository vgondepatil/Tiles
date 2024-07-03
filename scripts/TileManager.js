import { nanoid } from 'https://cdn.skypack.dev/nanoid@4.0.0';

// Tile object 
// properties: id, icon, pairId, face up flag, match flag

// function to generate array of tile objects and shuffle them
function generateTiles(icons = []) {
  // generate array of tile objects based on icons input
  const tiles = [];
  for (const icon of icons) {
    let tile = {
      icon: icon,
      pairId: nanoid(),
      faceUp: false,
      matched: false,
    };
    tiles.push(tile);
    // push tile again to create pair, making sure it's treated as a separate object
    tiles.push(JSON.parse(JSON.stringify(tile)));
  }
  // add unique id to each tile object
  tiles.forEach((t) => {
    t[`_id`] = nanoid();
  });
  // randomly shuffle tiles
  const shuffledTiles = tiles.sort((a, b) => 0.5 - Math.random());
  return shuffledTiles;
}

// class to manage CRUD operations for tiles
export class TileApp {
  constructor(icons = []) {
    this.icons = icons;
    // CREATE - call above function to generate tiles array
    this.tiles = generateTiles(icons);
  }
  // CREATE - reset tiles (i.e. create new tiles array to reset game)
  resetTiles() {
    this.tiles = generateTiles(this.icons);
  }
  // READ - read in single tile by id
  findTileById(id) {
    return this.tiles.find((t) => {
      return t._id === id;
    });
  }
  // READ - read in face up tiles
  findFaceUpTiles(tiles) {
    return tiles.filter((t) => {
      return t.faceUp === true;
    });
  }
  // READ - read in unmatched tiles
  findUnmatchedTiles(tiles) {
    return tiles.filter((t) => {
      return t.matched === false;
    });
  }
  // READ - read in matched tiles
  findMatchedTiles(tiles) {
    return tiles.filter((t) => {
      return t.matched === true;
    });
  }
  // UPDATE - flip single tile up (i.e. set faceUp flag to true)
  flipTileUp(tile) {
    if (!tile.faceUp) {
      tile.faceUp = true;
    } else if (tile.faceUp) {
      tile.faceUp = false;
    }
  }
  // UPDATE - flip tiles down (i.e. set faceUp flag to false)
  flipTilesDown(tiles) {
    tiles.forEach((t) => {
      t.faceUp = false;
    });
  }
  // UPDATE - mark tiles as a match (i.e. set matched flag to true)
  matchTiles(tiles) {
    tiles.forEach((t) => {
      t.matched = true;
    });
  }
  // OTHER - check if tiles match
    isMatch(tiles) {
    const pairId = tiles[0].pairId;
    return tiles.every((t) => {
      return t.pairId === pairId;
    })
  }
  // DELETE - N/A?
}

// set input icons for tiles (font awesome icon class names)
const icons = [
  `fa-truck-fast`,
  `fa-camera-retro`,
  `fa-mug-hot`,
  `fa-lemon`,
  `fa-flask`,
  `fa-tree`,
  `fa-rocket`,
  `fa-robot`,
];

// create new tile manager object
const tileApp = new TileApp(icons);
console.log(tileApp.tiles);
