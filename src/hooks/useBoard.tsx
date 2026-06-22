import {
  checkGameEnd,
  generateNewTile,
  mergeTiles,
  reverseRotate,
  rotate,
} from "@/game/tileLogic";
import { Board, Tile } from "@/types";
import { useRef, useState } from "react";
import { GestureResponderEvent } from "react-native";

const generateId = () =>
  typeof globalThis.crypto !== "undefined" &&
  typeof globalThis.crypto.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

export function useBoard() {
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [score, setScore] = useState(0);
  const [[board, prevBoard], setBoard] = useState(generateInitialBoard());
  const touchStart = useRef({ x: 0, y: 0 });

  function generateInitialBoard(): [Board, Board] {
    let board: Board = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row: Tile[] = [];

      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const id = generateId();
        row.push({
          id,
          col: colIndex,
          row: rowIndex,
          value: 0,
          from: id,
          type: null,
        });
      }
      board.push(row);
    }
    board = generateNewTile(generateNewTile(board));
    return [board, board];
  }

  function resetBoard() {
    setScore(0);
    setIsGameEnd(false);
    setBoard(generateInitialBoard());
  }

  function applyMove(nextBoard: Board, moveScore: number) {
    setScore((current) => current + moveScore);
    const end = checkGameEnd(nextBoard);
    setIsGameEnd(end);
    if (!end) nextBoard = generateNewTile(nextBoard);
    setBoard([nextBoard, board]);
  }

  function tilesLeft() {
    const merged = mergeTiles(board);
    applyMove(merged.board, merged.score);
  }

  function tilesDown() {
    const merged = mergeTiles(rotate(board));
    const nextBoard = reverseRotate(merged.board);
    applyMove(nextBoard, merged.score);
  }

  function tilesRight() {
    const merged = mergeTiles(rotate(rotate(board)));
    const nextBoard = rotate(rotate(merged.board));
    applyMove(nextBoard, merged.score);
  }

  function tilesUp() {
    const merged = mergeTiles(reverseRotate(board));
    const nextBoard = rotate(merged.board);
    applyMove(nextBoard, merged.score);
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
    prevBoard,
    setBoard,
    isGameEnd,
    score,
    resetBoard,
    handleTouchStart,
    handleTouchEnd,
    tilesUp,
    tilesDown,
    tilesLeft,
    tilesRight,
  };
}
