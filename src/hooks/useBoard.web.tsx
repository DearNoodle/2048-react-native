import {
  generateNewTile,
  mergeTiles,
  reverseRotate,
  rotate,
} from "@/game/tileLogic";
import { Board, Tile } from "@/types";
import { useEffect, useState } from "react";

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

      board[0][0].value = 2;
    }

    return board;
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "arrowup") tilesUp();
      else if (key === "s" || key === "arrowdown") tilesDown();
      else if (key === "a" || key === "arrowleft") tilesLeft();
      else if (key === "d" || key === "arrowright") tilesRight();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [board]);

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

  return { board, setBoard };
}
