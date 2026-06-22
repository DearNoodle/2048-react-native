import {
  checkGameEnd,
  generateNewTile,
  mergeTiles,
  reverseRotate,
  rotate,
} from "@/game/tileLogic";
import { Board, Tile } from "@/types";
import { useEffect, useState } from "react";

export function useBoard() {
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [score, setScore] = useState(0);
  const [[board, prevBoard], setBoard] = useState(generateInitialBoard());

  function generateInitialBoard(): [Board, Board] {
    let board: Board = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row: Tile[] = [];

      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const id = crypto.randomUUID();
        row.push({
          id: id,
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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const key = event.key.toLowerCase();
      if (key === "w" || key === "arrowup") tilesUp();
      else if (key === "s" || key === "arrowdown") tilesDown();
      else if (key === "a" || key === "arrowleft") tilesLeft();
      else if (key === "d" || key === "arrowright") tilesRight();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [board]);

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

  return { board, prevBoard, setBoard, isGameEnd, score, resetBoard };
}
