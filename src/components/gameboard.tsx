import { useBoard } from "@/hooks/useBoard";
import { Tile } from "@/types";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { BoardTile } from "./boardTile";
import { GameEndModal } from "./gameEndModal";

export function GameBoard() {
  const { board, prevBoard, isGameEnd } = useBoard();
  const flatBoard = useMemo(() => board.flat(), [board]);
  const flatPrevBoard = useMemo(() => prevBoard.flat(), [prevBoard]);
  // const valuesMatrix = board.map((row) =>
  //   row.map((tile: Tile) => (tile.value === 0 ? "." : tile.value)),
  // );

  // console.log("--- 當前 4x4 方塊佈局 ---");
  // console.table(valuesMatrix);
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        {flatBoard.flat().map((tile: Tile) => {
          const prevTile =
            flatPrevBoard.find(
              (pTile: Tile) => tile.from && tile.from === pTile.id,
            ) ?? tile;
          return <BoardTile key={tile.id} tile={tile} prevTile={prevTile} />;
        })}
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
});
