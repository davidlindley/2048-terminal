import chalk from 'chalk';
import config from './config';

export default class Cell {
  constructor(value = '') {
    this.value = value;
    this.doubleNumber = '';
    if (this.value !== '') {
      this.doubleNumber = this.value * 2;
    }
    this.modified = false;
  }

  toString(cellWidth = 10) {
    if (this.isEmpty()) {
      return this.value;
    }
    if (config.hasOwnProperty(this.value)) {
      return chalk.bold.white.bgHex(config[this.value])(this._padCell(this.value, cellWidth));
    } else {
      return chalk.bold.white.bgHex(config[2048])(this._padCell(this.value, cellWidth));
    }
  }

  _padCell(value, width) {
    const valueLength = `${value}`.length;
    const paddingValue = Math.floor(((width - valueLength) - 1) / 2);
    const padArray = new Array(paddingValue).fill(' ');
    let returnStr =  `${padArray.join('')}${value}${padArray.join('')}`;
    if (width !== (returnStr.length + 1)) {
      // Fill the remainder
      returnStr = `${returnStr}${new Array(width - (returnStr.length + 1)).fill(' ').join('')}`;
    }
    return returnStr;
  }

  /**
   * Resets the modified state
   */
  reset() {
    this.modified = false;
  }

  /**
   * Doubles the cell value
   */
  double() {
    this.value = this.doubleNumber;
    this.doubleNumber = this.value * 2;
    this.modified = true;
  }

  /**
   * Checks the cell can be modified
   * @returns {boolean}
   */
  canBeModified() {
    return !this.modified;
  }

  /**
   * Checks if the cell is empty
   * @returns {boolean}
   */
  isEmpty() {
    return this.value === '';
  }

  /**
   * Empties the cell
   */
  emptyCell() {
    this.value = '';
    this.doubleNumber = '';
    this.modified = false;
  }

  /**
   * Sets the cell value
   * @param value
   */
  setValue(value) {
    this.value = value;
    this.doubleNumber = this.value * 2;
  }

  /**
   * Gets the cells value
   * @returns {*|string}
   */
  getValue() {
    return this.value;
  }
}
