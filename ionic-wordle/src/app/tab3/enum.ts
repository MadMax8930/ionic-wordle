export enum LetterState {
  WRONG,  // you know.
  PARTIAL_MATCH, // letter in word but position is wrong.
  FULL_MATCH, // letter and position are all correct.
  PENDING,  // before the current try is submitted.
}
