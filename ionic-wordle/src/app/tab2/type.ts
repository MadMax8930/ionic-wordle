// Un essai
export interface Essai {
  letters: Letter[];
}

// Une lettre dans un essai
export interface Letter {
  text: string;
  state: LetterState;
}

// Enum qui store tous les essais
export enum LetterState {
  wrongMatchState, // L
  partialMatchState, // letter + position -
  fullMatchState, // lettre + position +
  pendingState,  // avant que le current essai soit submit
}
