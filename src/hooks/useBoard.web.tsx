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

  function tilesLeft() {
    let newBoard = mergeTiles(board);
    checkGameEnd(newBoard);
    newBoard = generateNewTile(newBoard);
    setBoard([newBoard, board]);
  }

  function tilesDown() {
    let newBoard = mergeTiles(rotate(board));
    newBoard = reverseRotate(newBoard);
    checkGameEnd(newBoard);
    newBoard = generateNewTile(newBoard);
    setBoard([newBoard, board]);
  }

  function tilesRight() {
    let newBoard = mergeTiles(rotate(rotate(board)));
    newBoard = rotate(rotate(newBoard));
    checkGameEnd(newBoard);
    newBoard = generateNewTile(newBoard);
    setBoard([newBoard, board]);
  }

  function tilesUp() {
    let newBoard = mergeTiles(reverseRotate(board));
    newBoard = rotate(newBoard);
    checkGameEnd(newBoard);
    newBoard = generateNewTile(newBoard);
    setBoard([newBoard, board]);
  }

  return { board, prevBoard, setBoard };
}
