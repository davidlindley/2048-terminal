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

  toString() {
    if (this.isEmpty()) {
      return this.value;
    }
    if (config.hasOwnProperty(this.value)) {
      return chalk.bold.white.bgHex(config[this.value])(`   ${this.value}    `);
    } else {
      return chalk.bold.white.bgHex(config[2048])(`   ${this.value}    `);
    }
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
