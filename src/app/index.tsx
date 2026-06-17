import { useTiles } from "@/hooks/useBoard";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { tiles, handleTouchStart, handleTouchEnd } = useTiles();

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {tiles.map((rowTiles, rowId) => (
        <View key={rowId} style={styles.tileRow}>
          {rowTiles.map((tile, id) => {
            const theme =
              tileTheme[tile] || (tile > 2048 ? tileTheme[">2048"] : null);
            return (
              <View
                key={id}
                style={[styles.tile, { backgroundColor: theme?.bg || "#ccc" }]}
              >
                <Text
                  style={[styles.tileText, { color: theme?.text || "#776e65" }]}
                >
                  {tile !== 0 ? tile : ""}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
const tileTheme: Record<
  number | ">2048",
  { bg: string; text: string; size: number }
> = {
  2: { bg: "#eee4da", text: "#776e65", size: 32 }, // Soft light cream
  4: { bg: "#ede0c8", text: "#776e65", size: 32 }, // Sandy neutral
  8: { bg: "#f2b179", text: "#f9f6f2", size: 32 }, // Soft melon peach
  16: { bg: "#f59563", text: "#f9f6f2", size: 32 }, // Terracotta orange
  32: { bg: "#f67c5f", text: "#f9f6f2", size: 32 }, // Deep coral red
  64: { bg: "#f65e3b", text: "#f9f6f2", size: 32 }, // Vibrant tomato red
  128: { bg: "#edcf72", text: "#f9f6f2", size: 28 }, // Pale brass yellow
  256: { bg: "#edcc61", text: "#f9f6f2", size: 28 }, // Soft gold
  512: { bg: "#edc850", text: "#f9f6f2", size: 28 }, // Bright marigold
  1024: { bg: "#edc53f", text: "#f9f6f2", size: 22 }, // Rich amber gold
  2048: { bg: "#edc22e", text: "#f9f6f2", size: 22 }, // Ultimate deep gold
  ">2048": { bg: "#73b", text: "#ffffff", size: 20 },
};

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
    width: 80,
    height: 80,
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
