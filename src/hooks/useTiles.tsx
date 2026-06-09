import {
  generateNewTile,
  mergeTiles,
  reverseRotate,
  rotate,
} from "@/game/tileLogic";
import { useEffect, useState } from "react";

export function useTiles() {
  const [tiles, setTiles] = useState([
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 0],
  ]);

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
  }, [tiles]);

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

  return { tiles, setTiles };
}
