export interface Vibhakthi {
  [key: string]: any[];
}

export interface Word {
  [key: string]: Vibhakthi;
}

export interface Data {
  [key: string]: Word;
}
