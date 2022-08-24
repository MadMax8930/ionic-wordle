/* eslint-env es6 */
/* eslint-disable no-console */
  export const state = {
    secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    grid: Array(6)
      .fill()
      .map(() => Array(5).fill('')),
    currentRow: 0,
    currentCol: 0,
  };



