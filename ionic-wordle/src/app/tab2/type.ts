// eslint-disable-next-line @typescript-eslint/naming-convention
export enum LetterState {
  wrongMatchState, // you know.
  partialMatchState, // letter in word but position is wrong.
  fullMatchState, // letter and position are all correct.
  pendingState,  // before the current try is submitted.
}
