import { useBoard } from "@/hooks/useBoard";
import { Tile } from "@/types";
import { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BoardTile } from "./boardTile";
import { GameEndModal } from "./gameEndModal";

export function GameBoard() {
  const { board, prevBoard, isGameEnd, handleTouchStart, handleTouchEnd } =
    useBoard();
  // web or mobile css style
  const boardStyle = [
    styles.board,
    Platform.OS !== "web" && styles.mobileBoard,
  ];

  // const valuesMatrix = board.map((row) =>
  //   row.map((tile: Tile) => (tile.value === 0 ? "." : tile.value)),
  // );

  // console.log("--- 當前 4x4 方塊佈局 ---");
  // console.table(valuesMatrix);

  const boardTiles = useMemo(() => {
    const flatBoard = board.flat();
    const flatPrevBoard = prevBoard.flat();
    return flatBoard.map((tile: Tile) => {
      const prevTile =
        flatPrevBoard.find(
          (pTile: Tile) => tile.from && tile.from === pTile.id,
        ) ?? tile;
      return <BoardTile key={tile.id} tile={tile} prevTile={prevTile} />;
    });
  }, [board, prevBoard]);

  return (
    <View style={styles.container}>
      <View
        style={boardStyle}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {boardTiles}
        <GameEndModal isVisible={isGameEnd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    position: "relative",
    backgroundColor: "#bbada0",
    padding: 12,
    borderRadius: 12,
    width: 480,
    height: 480,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
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
  mobileBoard: {
    transform: [{ scale: 0.8 }],
  },
});
