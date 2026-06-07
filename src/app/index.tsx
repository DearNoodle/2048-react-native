import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
export default function Index() {
  const [tiles, setTiles] = useState([
    [2, 0, 0, 0],
    [2, 2, 0, 0],
    [2, 2, 2, 0],
    [2, 2, 2, 2],
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "arrowup") tilesUp();
      else if (key === "s" || key === "arrowdown") tilesDown();
      else if (key === "a" || key === "arrowleft") tilesLeft();
      else if (key === "d" || key === "arrowright") tilesRight();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tiles]);

  function mergeRowTiles(arr: number[]) {
    let filteredArr: number[] = arr.filter((num) => num !== 0);
    for (let i = 0; i < filteredArr.length - 1; i++) {
      if (filteredArr[i] === filteredArr[i + 1]) {
        filteredArr[i] *= 2;
        filteredArr[i + 1] = 0;
        i++;
      }
    }
    filteredArr = filteredArr.filter((num) => num !== 0);
    while (filteredArr.length < arr.length) {
      filteredArr.push(0);
    }
    return filteredArr;
  }

  function rotate(matrix: number[][]) {
    return matrix[0].map((_, colIndex) =>
      matrix.map((row) => row[colIndex]).reverse(),
    );
  }

  function reverseRotate(matrix: number[][]) {
    return matrix[0]
      .map((_, colIndex) =>
        matrix
          .map((row) => row[colIndex])
          .reverse()
          .reverse(),
      )
      .reverse();
  }

  function tilesLeft() {
    let rotatedTiles = tiles;
    let newTiles: number[][] = [];
    rotatedTiles.forEach((rowTiles) => {
      newTiles.push(mergeRowTiles(rowTiles));
    });
    setTiles(newTiles);
    console.log(newTiles);
  }

  function tilesDown() {
    let rotatedTiles = rotate(tiles);
    let newTiles: number[][] = [];
    rotatedTiles.forEach((rowTiles) => {
      newTiles.push(mergeRowTiles(rowTiles));
    });
    newTiles = reverseRotate(newTiles);
    setTiles(newTiles);
    console.log(newTiles);
  }

  function tilesRight() {
    let rotatedTiles = rotate(rotate(tiles));
    let newTiles: number[][] = [];
    rotatedTiles.forEach((rowTiles) => {
      newTiles.push(mergeRowTiles(rowTiles));
    });
    newTiles = rotate(rotate(newTiles));
    setTiles(newTiles);
    console.log(newTiles);
  }

  function tilesUp() {
    let rotatedTiles = reverseRotate(tiles);
    let newTiles: number[][] = [];
    rotatedTiles.forEach((rowTiles) => {
      newTiles.push(mergeRowTiles(rowTiles));
    });
    newTiles = rotate(newTiles);
    setTiles(newTiles);
    console.log(newTiles);
  }

  return (
    <View style={styles.container}>
      {tiles.map((rowTiles, rowId) => (
        <View key={rowId} style={styles.tileRow}>
          {rowTiles.map((tile, id) => (
            <View key={id} style={styles.tile}>
              <Text style={styles.tileText}>{tile}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#faf8ef",
    padding: 20,
  },
  tileRow: {
    flexDirection: "row",
  },
  tile: {
    width: 100,
    height: 100,
    backgroundColor: "#cdc1b4",
    margin: 4,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#776e65",
  },
});
