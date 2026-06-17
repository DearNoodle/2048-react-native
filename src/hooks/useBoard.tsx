import {
  generateNewTile,
  mergeTiles,
  reverseRotate,
  rotate,
} from "@/game/tileLogic";
import { Board, Tile } from "@/types";
import { useRef, useState } from "react";
import { GestureResponderEvent } from "react-native";

export function useBoard() {
  const [board, setBoard] = useState(generateInitialBoard());
  function generateInitialBoard(): Board {
    const board: Board = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row: Tile[] = [];

      for (let colIndex = 0; colIndex < 4; colIndex++) {
        row.push({
          id: rowIndex * 4 + colIndex,
          value: null,
        });
      }

      board.push(row);
    }

    return board;
  }

  const touchStart = useRef({ x: 0, y: 0 });

  function removeId(board: Board) {
    const tiles: (number | null)[][] = board.map((row) =>
      row.map((tile) => tile.value),
    );
    return tiles;
  }
  function giveId(tiles: (number | null)[][]) {
    let id: number = 0;
    const newBoard: Board = tiles.map((row) =>
      row.map((val) => ({
        id: id++,
        value: val,
      })),
    );
    return newBoard;
  }

  function tilesLeft() {
    let tiles = removeId(board);
    tiles = mergeTiles(tiles);
    tiles = generateNewTile(tiles);
    const newBoard = giveId(tiles);
    setBoard(newBoard);
  }

  function tilesDown() {
    let tiles = removeId(board);
    tiles = mergeTiles(rotate(tiles));
    tiles = reverseRotate(tiles);
    tiles = generateNewTile(tiles);
    const newBoard = giveId(tiles);
    setBoard(newBoard);
  }

  function tilesRight() {
    let tiles = removeId(board);
    tiles = mergeTiles(rotate(rotate(tiles)));
    tiles = rotate(rotate(tiles));
    tiles = generateNewTile(tiles);
    const newBoard = giveId(tiles);
    setBoard(newBoard);
  }

  function tilesUp() {
    let tiles = removeId(board);
    tiles = mergeTiles(reverseRotate(tiles));
    tiles = rotate(tiles);
    tiles = generateNewTile(tiles);
    const newBoard = giveId(tiles);
    setBoard(newBoard);
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
    board,
    setBoard,
    handleTouchStart,
    handleTouchEnd,
    tilesUp,
    tilesDown,
    tilesLeft,
    tilesRight,
  };
}
