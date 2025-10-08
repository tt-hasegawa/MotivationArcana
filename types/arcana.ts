export interface ArcanaCard {
  no: number;
  title: string;
  description: string;
  intrinsicPoint: number;
  extrinsicPoint: number;
  collectivePoint: number;
  individualPoint: number;
}

export enum GameScreen {
  TITLE = 'title',
  SELECTION = 'selection',
  RESULT = 'result'
}

export interface DiagnosisArchetype {
  id: number;
  title: string;
  axisCharacteristics: string;
  explanation: string;
  typicalExamples: string;
}