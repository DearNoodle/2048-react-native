export function mergeTiles(tiles: (number | null)[][]) {
  function mergeRowTiles(rowTiles: (number | null)[]) {
    let newRowTiles: (number | null)[] = rowTiles.filter((num) => num !== null);
    for (let i = 0; i < newRowTiles.length - 1; i++) {
      if (newRowTiles[i] === newRowTiles[i + 1]) {
        newRowTiles[i]! *= 2;
        newRowTiles[i + 1] = null;
        i++;
      }
    }
    newRowTiles = newRowTiles.filter((num) => num !== 0);
    while (newRowTiles.length < rowTiles.length) {
      newRowTiles.push(null);
    }
    return newRowTiles;
  }

  let newTiles: (number | null)[][] = [];
  tiles.forEach((rowTiles) => {
    newTiles.push(mergeRowTiles(rowTiles));
  });

  return newTiles;
}

export function rotate(tiles: (number | null)[][]) {
  tiles = tiles[0].map((_, colIndex) =>
    tiles.map((row) => row[colIndex]).reverse(),
  );
  return tiles;
}

export function reverseRotate(tiles: (number | null)[][]) {
  tiles = tiles[0]
    .map((_, colIndex) =>
      tiles
        .map((row) => row[colIndex])
        .reverse()
        .reverse(),
    )
    .reverse();
  return tiles;
}

export function generateNewTile(tiles: (number | null)[][]) {
  function allAdjacentsNotSame() {
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (i + 1 < tiles.length && tiles[i][j] === tiles[i + 1][j]) {
          return false;
        }
        if (j + 1 < tiles[i].length && tiles[i][j] === tiles[i][j + 1]) {
          return false;
        }
      }
    }
    return true;
  }
  if (tiles.every((row) => row.every((val) => val !== null))) {
    if (allAdjacentsNotSame()) {
      alert("end");
      // gameEnd();
    }
    return tiles;
  }
  const tileValue = Math.random() < 0.5 ? 2 : 4;
  let x, y;
  do {
    x = Math.floor(Math.random() * 4);
    y = Math.floor(Math.random() * 4);
  } while (tiles[x][y] !== null);
  tiles[x][y] = tileValue;
  return tiles;
}
