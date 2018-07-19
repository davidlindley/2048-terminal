import TerminalWriter from '../terminal-writer';
import KeyHandler from '../key-handler';
import Matrix from './matrix';

export default new class GameEngine {

  // How big the grid should be
  gameSize = 4;
  cellWidth = 10;
  // The cells sit within the matrix
  matrix;

  /**
   * Sets up the game
   */
  setup() {
    // Register the key handler
    this.keyHandler = new KeyHandler(
      { key: 'right', action: this.right },
      { key: 'left', action: this.left },
      { key: 'up', action: this.up},
      { key: 'down', action: this.down },
      { key: 'r', action: this.restart });
    this.terminalWriter = new TerminalWriter(this.gameSize, this.cellWidth);
    this.restart();
  }

  /**
   * Prints to console
   */
  print() {
    this.terminalWriter.writeTable(this.matrix.convertToArray(), this.matrix.getMaxValue());
    this.matrix.resetCells();
  }

  /**
   * Restarts the game
   */
  restart = () => {
    this.matrix = new Matrix(this.gameSize, this.cellWidth);
    this.print();
  };

  /**
   * Left key pressed
   */
  left = () => {
    this.arrowKeyPress([0, this.gameSize - 1], [this.gameSize - 1,0], true);
  };

  /**
   * Right key pressed
   */
  right = () => {
    this.arrowKeyPress([this.gameSize - 1,0], [this.gameSize - 1,0], true);
  };

  /**
   * Up key pressed
   */
  up = () => {
    this.arrowKeyPress([this.gameSize - 1,0], [0,this.gameSize - 1], false);
  };

  /**
   * Down key pressed
   */
  down = () => {
    this.arrowKeyPress([this.gameSize - 1,0], [this.gameSize - 1,0], false)
  };

  /**
   * Handle the arrow keys and then add a random cell and print
   * @param xRange
   * @param yRange
   * @param horizontal
   * @param checkEndGame
   */
  arrowKeyPress(xRange, yRange, horizontal) {
    this.processCells(xRange, yRange, horizontal);
    this.matrix.addRandomCell();
    this.print();
    // Check if now full
    if (this.matrix.isFull()) {
      if(this.isEndGame()) {
        // Game has ended. Write the screen
        this.terminalWriter.writeEndOfGame(this.matrix.convertToArray(), this.matrix.getMaxValue());
      }
    }
  }

  isEndGame() {
    // Make a copy of the matrix
    this.matrix.copyMatrix();
    // Run through all the arrows to see the matrix is still full
    // Down, up, right, left
    this.processCells([this.gameSize - 1,0], [this.gameSize - 1,0], false);
    this.processCells([this.gameSize - 1,0], [0,this.gameSize - 1], false);
    this.processCells([this.gameSize - 1,0], [this.gameSize - 1,0], true);
    this.processCells([0, this.gameSize - 1], [this.gameSize - 1,0], true);

    // Check if if it still full
    if(this.matrix.isFull()) {
      // End game
      return true;
    }

    this.matrix.restoreMatrix();
    return false;
  }

  /**
   * Gets the array of keys to loop through
   * @param xRange
   * @param yRange
   * @param horizonal
   * @returns {Array}
   */
  getRangeArray(xRange = [], yRange = [], horizonal = true) {
    let coords = [];
    const convertRange = (range) => {
      let outputRange = [];
      if (Math.sign(range[0] - range[1]) > 0) {
        // Negative (eg. 4, 3, 2, 1)
        for (let count = range[0]; count > (range[1] - 1); count--) {
          outputRange.push(count);
        }
      } else {
        // Positive (e.g. 0,1,2,3)
        for (let count = range[0]; count < (range[1] + 1); count++) {
          outputRange.push(count);
        }
      }
      return outputRange;
    };

    xRange = convertRange(xRange);
    yRange = convertRange(yRange);

    if (horizonal) {
      for (let i = 0; i < yRange.length; i++) {
        let y = yRange[i];
        for (let j = 0; j < xRange.length; j++) {
          let x = xRange[j];
          coords.push(`${x}:${y}`);
        }
      }
    } else {
      for (let i = 0; i < xRange.length; i++) {
        let x = xRange[i];
        for (let j = 0; j < yRange.length; j++) {
          let y = yRange[j];
          coords.push(`${x}:${y}`);
        }
      }
    }

    let output = [];
    // Now split coords into chunks for easy looping
    for (let count = 0; count < coords.length; count += this.gameSize) {
      output.push(coords.slice(count, count + this.gameSize));
    }

    return output;
  }

  /**
   * Processes the cells
   * @param xRange
   * @param yRange
   * @param horizontal
   */
  processCells(xRange = [], yRange = [], horizontal = false) {

    const matrixKeys = this.getRangeArray(xRange, yRange, horizontal);

    matrixKeys.forEach((keySet) => {
      for (let count = 0; count < keySet.length; count++) {
        const key = keySet[count];
        const nextKey = keySet[count + 1] ? keySet[count + 1] : null;
        const cell = this.matrix.getCellKey(key);
        const nextCell = this.matrix.getCellKey(nextKey);

        if (nextCell) {
          if (nextCell.isEmpty()) {
            // Next cell is empty so add the current value into it
            nextCell.setValue(cell.getValue());
            cell.emptyCell();
          } else if (cell.getValue() === nextCell.getValue() && cell.canBeModified()) {
            // next and current are equal so double the next
            nextCell.double();
            cell.emptyCell();
          }
        }
      }

      // Remove empty cells
      this.removeEmptyCells(keySet);
    });
  }

  /**
   * Removed any empty cells
   * @param keySet
   */
  removeEmptyCells(keySet = []) {
    for (let index = 0; index < keySet.length; index++) {
      const cell = this.matrix.getCellKey(keySet[index]);

      if (cell.isEmpty()) {
        // cell is empty so now move up the chain until we find a non-empty key and swap it over
        let found = false;
        let count = 1;
        while(!found) {
          if (index + count < keySet.length) {
            const nextCell = this.matrix.getCellKey(keySet[index + count]);
            if (nextCell) {
              if (!nextCell.isEmpty()) {
                // Next cell has a value. Swap over the amounts
                cell.setValue(nextCell.getValue());
                nextCell.emptyCell();
                found = true;
              } else {
                // Next cell is empty. Move to the next cell
                count++;
              }
            } else {
              // No point moving as last cell
              found = true;
            }
          } else {
            // No point moving as last cell
            found = true;
          }
        }
      }
    }
  }
}
