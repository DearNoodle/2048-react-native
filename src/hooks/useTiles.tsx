import {
  generateNewTile,
  mergeTiles,
  reverseRotate,
  rotate,
} from "@/game/tileLogic";
import { useRef, useState } from "react";
import { GestureResponderEvent } from "react-native";

export function useTiles() {
  const [tiles, setTiles] = useState([
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 0],
  ]);

  const touchStart = useRef({ x: 0, y: 0 });

  function tilesLeft() {
    let newTiles: number[][] = [];
    mergeTiles(tiles, newTiles);
    generateNewTile(newTiles);
    setTiles(newTiles);
  }

  function tilesDown() {
    let newTiles: number[][] = [];
    mergeTiles(rotate(tiles), newTiles);
    newTiles = reverseRotate(newTiles);
    generateNewTile(newTiles);
    setTiles(newTiles);
  }

  function tilesRight() {
    let newTiles: number[][] = [];
    mergeTiles(rotate(rotate(tiles)), newTiles);
    newTiles = rotate(rotate(newTiles));
    generateNewTile(newTiles);
    setTiles(newTiles);
  }

  function tilesUp() {
    let newTiles: number[][] = [];
    mergeTiles(reverseRotate(tiles), newTiles);
    newTiles = rotate(newTiles);
    generateNewTile(newTiles);
    setTiles(newTiles);
  }

  const handleTouchStart = (e: GestureResponderEvent) => {
    touchStart.current = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };
  };

  const handleTouchEnd = (e: GestureResponderEvent) => {
    const touchEndX = e.nativeEvent.pageX;
    const touchEndY = e.nativeEvent.pageY;

    const dx = touchEndX - touchStart.current.x;
    const dy = touchEndY - touchStart.current.y;

    const SWIPE_THRESHOLD = 30;

    if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          tilesRight();
        } else {
          tilesLeft();
        }
      } else {
        if (dy > 0) {
          tilesDown();
        } else {
          tilesUp();
        }
      }
    }
  };

  return {
    tiles,
    setTiles,
    handleTouchStart,
    handleTouchEnd,
    tilesUp,
    tilesDown,
    tilesLeft,
    tilesRight,
  };
}
