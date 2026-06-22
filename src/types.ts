export type Tile = {
  id: string;
  col: number;
  row: number;
  value: number;
  from: string | null;
  type: "rest" | "move" | "merge" | "spawn" | null;
};

export type Board = Tile[][];
