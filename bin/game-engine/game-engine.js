import TerminalWriter from '../terminal-writer';
import KeyHandler from '../key-handler';
import Matrix from './matrix';

export default new class GameEngine {

  gameSize = 4;

  /**
   * Sets up the game
   */
  setup() {
    // Register the key handler
    this.keyHandler = new KeyHandler(
      { key: 'right', action: this.right },
      { key: 'left', action: this.left },
      { key: 'up', action: this.up},
      { key: 'down', action: this.down });
    this.matrix = new Matrix(4);
    // Print initial state
    this.print();
  }

  /**
   * Prints to console
   */
  print() {
    TerminalWriter.writeTable(this.matrix.convertToArray(), this.matrix.getMaxValue());
    this.matrix.resetCells();
  }

  /**
   * Left key pressed
   */
  left = () => {
    this.processCells([0,3], [3,0], true);
    this.matrix.addRandomCell();
    this.print();
  };

  /**
   * Right key pressed
   */
  right = () => {
    this.processCells([3,0], [3,0], true);
    this.matrix.addRandomCell();
    this.print();
  };

  /**
   * Up key pressed
   */
  up = () => {
    this.processCells([3,0], [0,3], false);
    this.matrix.addRandomCell();
    this.print();
  };

  /**
   * Down key pressed
   */
  down = () => {
    this.processCells([3,0], [3,0], false);
    this.matrix.addRandomCell();
    this.print();
  };

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
