export interface ArcanaCard {
  no: number;
  title: string;
  description: string;
  intrinsicPoint: number;
  extrinsicPoint: number;
}

export enum GameScreen {
  TITLE = 'title',
  SELECTION = 'selection',
  RESULT = 'result'
}