import { Tile } from "@/types";

export function mergeTiles(tiles: Tile[][]) {
  function mergeRowTiles(rowTiles: Tile[]) {
    const rTiles = rowTiles.map((tile) => ({ ...tile, from: tile.id }));
    // case12 ->
    // case13 & case23 ->
    // case14 & case24 & case34
    const mergeDict = [
      { mergeTo: 0, mergeBy: 1 },
      { mergeTo: 0, mergeBy: 2 },
      { mergeTo: 1, mergeBy: 2 },
      { mergeTo: 0, mergeBy: 3 },
      { mergeTo: 1, mergeBy: 3 },
      { mergeTo: 2, mergeBy: 3 },
    ];

    for (const mergeCase of mergeDict) {
      if (
        rTiles[mergeCase.mergeTo].value === rTiles[mergeCase.mergeBy].value &&
        rTiles[mergeCase.mergeTo].value !== 0
      ) {
        let isBlocked = false;
        for (let i = mergeCase.mergeTo + 1; i < mergeCase.mergeBy; i++) {
          if (rTiles[i].value !== 0) {
            isBlocked = true;
            break;
          }
        }
        if (isBlocked) {
          continue;
        }
        rTiles[mergeCase.mergeTo].value! *= 2;
        rTiles[mergeCase.mergeTo].from = rTiles[mergeCase.mergeBy].id;
        rTiles[mergeCase.mergeTo].type = "merge";
        rTiles[mergeCase.mergeBy].value = 0;

        // Double Merge Case of 0=1 and 2=3
        if (
          mergeCase.mergeTo === 0 &&
          mergeCase.mergeBy === 1 &&
          rTiles[2].value === rTiles[3].value &&
          rTiles[2].value !== 0
        ) {
          rTiles[2].value! *= 2;
          rTiles[2].from = rTiles[3].id;
          rTiles[2].type = "merge";
          rTiles[3].value = 0;
        }
        break;
      }
    }

    const activeTiles = rTiles.filter((tile) => tile.value !== 0);
    const emptyTiles = rTiles.filter((tile) => tile.value === 0);
    const resultTiles = [...activeTiles, ...emptyTiles];
    resultTiles.forEach((tile, index) => {
      const originalCol = tile.col;
      tile.col = index;

      if (tile.value === 0) {
        tile.type = null;
        return;
      }

      if (tile.type === "merge") {
        return;
      }

      tile.from = resultTiles[tile.col].id;
      tile.type = tile.col === originalCol ? "rest" : "move";
    });
    return resultTiles;
  }

  let newTiles: Tile[][] = [];
  tiles.forEach((rowTiles) => {
    newTiles.push(mergeRowTiles(rowTiles));
  });
  return newTiles;
}

export function rotate(tiles: Tile[][]): Tile[][] {
  const N = tiles.length;
  if (N === 0) return [];
  const rotated: Tile[][] = Array.from({ length: N }, () => new Array(N));

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const newRow = c;
      const newCol = N - 1 - r;

      const originalTile = tiles[r][c];

      rotated[newRow][newCol] = {
        ...originalTile,
        row: newRow,
        col: newCol,
      };
    }
  }
  return rotated;
}

export function reverseRotate(tiles: Tile[][]) {
  return rotate(rotate(rotate(tiles)));
}

export function checkGameEnd(tiles: Tile[][]) {
  function allAdjacentsNotSame() {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (
          i + 1 < tiles.length &&
          tiles[i][j].value === tiles[i + 1][j].value
        ) {
          return false;
        }
        if (
          j + 1 < tiles[i].length &&
          tiles[i][j].value === tiles[i][j + 1].value
        ) {
          return false;
        }
      }
    }
    return true;
  }
  if (tiles.every((row) => row.every((tile) => tile.value !== 0))) {
    if (allAdjacentsNotSame()) {
      alert("end");
      // gameEnd();
    }
    return tiles;
  }
}

export function generateNewTile(tiles: Tile[][]): Tile[][] {
  const emptyPositions: { x: number; y: number }[] = [];
  for (let x = 0; x < tiles.length; x++) {
    for (let y = 0; y < tiles[x].length; y++) {
      if (tiles[x][y].value === 0) {
        emptyPositions.push({ x, y });
      }
    }
  }
  if (emptyPositions.length === 0) {
    return tiles;
  }

  const randomIndex = Math.floor(Math.random() * emptyPositions.length);
  const { x, y } = emptyPositions[randomIndex];
  const tileValue = Math.random() < 0.9 ? 2 : 4;
  tiles[x][y].value = tileValue;
  tiles[x][y].type = "spawn";
  return tiles;
}
