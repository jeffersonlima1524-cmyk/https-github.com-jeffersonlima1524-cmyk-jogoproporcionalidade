
export enum GameState {
  START,
  CONCEPT,
  PLAYING,
  FEEDBACK,
  FINISHED,
}

export enum ProportionType {
  DIRECT = 'direta',
  INVERSE = 'inversa',
}

export interface Question {
  question: string;
  options: number[];
  answer: number;
  explanation: string;
}
