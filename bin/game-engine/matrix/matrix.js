import Cell from '../cell';

import hash from 'object-hash';

export default class Matrix {

  gameSize = 4;
  matrix = {};
  previousHash = '';

  constructor(gameSize = 4) {
    this.gameSize = gameSize;
    // Initliase the matrix
    for (let x = 0; x < this.gameSize; x++) {
      for (let y = 0; y < this.gameSize; y++) {
        this.matrix[`${x}:${y}`] = new Cell();
      }
    }
    this.addRandomCell();
  }

  /**
   * Gets a cell by x and y co-ords
   * @param x
   * @param y
   * @returns {*}
   */
  getCell(x, y) {
    return this.matrix[`${x}:${y}`];
  }

  /**
   * Gets cell by the key
   * @param key - x:y
   * @returns {*}
   */
  getCellKey(key) {
    if (this.matrix.hasOwnProperty(key)) {
      return this.matrix[key];
    }
    return null;
  }

  /**
   * Checks if hte matrix has changed
   * @returns {boolean}
   */
  hasChanged() {
    if (this.previousHash === hash(this.matrix)) {
      // Hashes the same so has not changed
      return false;
    }
    // Hashes different to has changed
    this.previousHash = hash(this.matrix);
    return true;
  }

  /**
   * Gets the max value
   * @returns {number}
   */
  getMaxValue() {
    let maxValue = 0;
    for (let key in this.matrix) {
      if (this.matrix[key].getValue() > maxValue) {
        maxValue = this.matrix[key].getValue();
      }
    }
    return maxValue;
  }

  /**
   * Adds a random cell to the matrix
   */
  addRandomCell() {
    if (this.hasChanged()) {
      let emptyCells = Object.keys(this.matrix).filter((key) => {
        return this.matrix[key].isEmpty();
      });
      // If there are any empty items
      if (emptyCells.length) {
        // Select a random index
        const randKey = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        // Populate that field with a 2
        this.matrix[randKey].setValue(2);
      }
      // Update the hash
      this.previousHash = hash(this.matrix);
    }
  }

  /**
   * Resets the state of all cells
   */
  resetCells() {
    for (let key in this.matrix) {
      this.matrix[key].reset();
    }
    this.previousHash = hash(this.matrix);
  }

  /**
   * Converts the matrix ready to be printed
   * @returns {Array}
   */
  convertToArray() {
    let toPrint = [];

    for (let y = 0; y < this.gameSize; y++) {
      let row = [];
      for (let x = 0; x < this.gameSize; x++) {
        row.push(this.getCell(x, y).getValue());
      }
      toPrint.push(row);
    }
    return toPrint;
  }

}
