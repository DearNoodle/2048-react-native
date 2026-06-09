export function mergeTiles(tiles: number[][], newTiles: number[][]) {
  function mergeRowTiles(rowTiles: number[]) {
    let newRowTiles: number[] = rowTiles.filter((num) => num !== 0);
    for (let i = 0; i < newRowTiles.length - 1; i++) {
      if (newRowTiles[i] === newRowTiles[i + 1]) {
        newRowTiles[i] *= 2;
        newRowTiles[i + 1] = 0;
        i++;
      }
    }
    newRowTiles = newRowTiles.filter((num) => num !== 0);
    while (newRowTiles.length < rowTiles.length) {
      newRowTiles.push(0);
    }
    return newRowTiles;
  }
  tiles.forEach((rowTiles) => {
    newTiles.push(mergeRowTiles(rowTiles));
  });
}

export function rotate(tiles: number[][]) {
  return tiles[0].map((_, colIndex) =>
    tiles.map((row) => row[colIndex]).reverse(),
  );
}

export function reverseRotate(tiles: number[][]) {
  return tiles[0]
    .map((_, colIndex) =>
      tiles
        .map((row) => row[colIndex])
        .reverse()
        .reverse(),
    )
    .reverse();
}

export function generateNewTile(tiles: number[][]) {
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
  if (tiles.every((row) => row.every((val) => val !== 0))) {
    if (allAdjacentsNotSame()) {
      alert("end");
      // gameEnd();
    }
    return;
  }
  const tileValue = Math.random() < 0.5 ? 2 : 4;

  let x, y;
  do {
    x = Math.floor(Math.random() * 4);
    y = Math.floor(Math.random() * 4);
  } while (tiles[x][y] !== 0);
  tiles[x][y] = tileValue;
}
