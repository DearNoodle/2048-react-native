import { useBoard } from "@/hooks/useBoard";
import { Tile } from "@/types";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BoardTile } from "./boardTile";
import { GameEndModal } from "./gameEndModal";

export function GameBoard() {
  const {
    board,
    prevBoard,
    isGameEnd,
    score,
    resetBoard,
    handleTouchStart,
    handleTouchEnd,
  } = useBoard();
  // web or mobile css style

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
      <View style={styles.header}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>得分</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <TouchableOpacity style={styles.replayButton} onPress={resetBoard}>
          <Text style={styles.replayButtonText}>↻</Text>
        </TouchableOpacity>
      </View>
      <View
        style={styles.board}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {boardTiles}
        <GameEndModal
          isVisible={isGameEnd}
          score={score}
          onReplay={resetBoard}
        />
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
  header: {
    width: 480,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  scoreBox: {
    backgroundColor: "#eee4da",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 120,
  },
  scoreLabel: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#776e65",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#5c534c",
  },
  replayButton: {
    backgroundColor: "#8f7a66",
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
  },
  replayButtonText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    lineHeight: 20,
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
});
