export enum Axis {
  X = "x",
  Y = "y",
}

export interface AppProps {
  axis?: Axis;
  length?: number;
}
