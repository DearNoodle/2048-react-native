import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function GameEndModal({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>{"💥 遊戲結束"}</Text>
        <Text style={styles.score}>得分：{"NaN"}</Text>

        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Text style={styles.buttonText}>再玩一次</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(238, 228, 218, 0.85)", // 2048 經典半透明米色
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // 確保絕對在最上層
  },
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
    width: 280,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#776e65",
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: "#776e65",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#8f7a66",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
