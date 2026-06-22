// react native web
import { Tile } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function BoardTile({ tile, prevTile }: { tile: Tile; prevTile: Tile }) {
  const tileWidth = 106;
  const tileMargin = 4;
  const cellSize = tileWidth + tileMargin * 2;

  const xPos = useSharedValue(tile.col * cellSize);
  const yPos = useSharedValue(tile.row * cellSize);
  const scale = useSharedValue(0);

  const hasValue = tile.value != null && tile.value !== 0;
  const textValue = useSharedValue(hasValue ? tile.value : 0);

  // Use a shared value to control the stationary merge-to tile scale so we
  // don't rerender to hide it. Start visible for a merge, otherwise hidden.
  const mergeToScale = useSharedValue(tile.type === "merge" ? 1 : 0);
  useEffect(() => {
    if (tile.type === "merge") {
      mergeToScale.value = 1;
    } else {
      mergeToScale.value = withTiming(0, { duration: 150 });
    }
  }, [tile.type]);

  switch (tile.type) {
    case "rest":
      scale.value = 1;
      xPos.value = tile.col * cellSize;
      yPos.value = tile.row * cellSize;
      break;

    case "move":
      scale.value = 1;
      xPos.value = prevTile.col * cellSize;
      yPos.value = prevTile.row * cellSize;
      xPos.value = withTiming(tile.col * cellSize, { duration: 250 });
      yPos.value = withTiming(tile.row * cellSize, { duration: 250 });
      break;

    case null:
      scale.value = 0;
      xPos.value = tile.col * cellSize;
      yPos.value = tile.row * cellSize;
      break;

    case "merge":
      // show previous value, position at prev tile, then animate to target
      textValue.value = prevTile.value ? prevTile.value : 0;
      scale.value = 1;
      xPos.value = prevTile.col * cellSize;
      yPos.value = prevTile.row * cellSize;

      // update displayed value after 300ms using a shared-value delay (no setTimeout)
      textValue.value = withDelay(
        250,
        withTiming(tile.value ? tile.value : 0, { duration: 1 }),
      );

      // animate movement; when finished shrink the merge-to tile
      xPos.value = withTiming(tile.col * cellSize, { duration: 250 });
      yPos.value = withTiming(
        tile.row * cellSize,
        { duration: 250 },
        (finished?: boolean) => {
          if (finished) {
            mergeToScale.value = 0;
            scale.value = withSequence(
              withTiming(1.1, { duration: 100 }), // 先快速放大到 1.1
              withSpring(1, {
                damping: 40,
                stiffness: 150,
              }),
            );
            tile.type = null;
          }
        },
      );
      break;

    case "spawn":
      xPos.value = tile.col * cellSize;
      yPos.value = tile.row * cellSize;
      // ensure the tile starts scaled to 0 so the spawn animation always runs
      scale.value = 0;
      scale.value = withDelay(350, withTiming(1, { duration: 250 }));
      break;

    default:
      console.error("Missing Tile Type");
      break;
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      left: 0,
      top: 0,
      transform: [
        { translateX: xPos.value },
        { translateY: yPos.value },
        { scale: scale.value },
      ],
    };
  });

  const mergeToAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: mergeToScale.value }],
  }));

  if (!hasValue) return <View />;

  const theme =
    tileTheme[tile.value] ||
    (tile.value > 2048 ? tileTheme[">2048"] : tileTheme[2]);

  const prevTheme =
    prevTile.value != null
      ? tileTheme[prevTile.value] ||
        (prevTile.value > 2048 ? tileTheme[">2048"] : null)
      : null;

  function InnerTileText({
    value,
    prevValue,
    type,
  }: {
    value: number;
    prevValue: number | null;
    type: string | null;
  }) {
    const [displayText, setDisplayText] = useState(() =>
      type === "merge" && prevValue ? prevValue : value,
    );

    useEffect(() => {
      if (type === "merge" && prevValue) {
        const timer = setTimeout(() => {
          setDisplayText(value);
        }, 300);
        return () => clearTimeout(timer);
      } else {
        setDisplayText(value);
      }
    }, [value, prevValue, type]);

    return (
      <Animated.Text
        style={[
          styles.tileText,
          {
            color: theme.text || "#776e65",
            fontSize: theme.size || 32,
          },
        ]}
      >
        {displayText}
      </Animated.Text>
    );
  }

  return (
    <>
      {/* stationary destination tile shown during merge (scale animated, no rerender) */}
      {tile.type === "merge" && (
        <Animated.View
          style={[
            styles.tile,
            {
              position: "absolute",
              left: tile.col * cellSize,
              top: tile.row * cellSize,
            },
            mergeToAnimatedStyle,
            { backgroundColor: prevTheme?.bg || "#ccc" },
          ]}
        >
          <Animated.Text
            style={[
              styles.tileText,
              {
                color: prevTheme?.text || "#776e65",
                fontSize: prevTheme?.size || 32,
              },
            ]}
          >
            {prevTile.value}
          </Animated.Text>
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.tile,
          animatedStyle,
          { backgroundColor: theme.bg || "#ccc" },
        ]}
      >
        <InnerTileText
          value={tile.value as number}
          prevValue={prevTile.value}
          type={tile.type}
        />
      </Animated.View>
    </>
  );
}
const tileTheme: Record<
  number | ">2048",
  { bg: string; text: string; size: number }
> = {
  2: { bg: "#eee4da", text: "#776e65", size: 32 },
  4: { bg: "#ede0c8", text: "#776e65", size: 32 },
  8: { bg: "#f2b179", text: "#f9f6f2", size: 32 },
  16: { bg: "#f59563", text: "#f9f6f2", size: 32 },
  32: { bg: "#f67c5f", text: "#f9f6f2", size: 32 },
  64: { bg: "#f65e3b", text: "#f9f6f2", size: 32 },
  128: { bg: "#edcf72", text: "#f9f6f2", size: 28 },
  256: { bg: "#edcc61", text: "#f9f6f2", size: 28 },
  512: { bg: "#edc850", text: "#f9f6f2", size: 28 },
  1024: { bg: "#edc53f", text: "#f9f6f2", size: 22 },
  2048: { bg: "#edc22e", text: "#f9f6f2", size: 22 },
  ">2048": { bg: "#73b", text: "#ffffff", size: 20 },
};

const styles = StyleSheet.create({
  tile: {
    width: 96,
    height: 96,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
