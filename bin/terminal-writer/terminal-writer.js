import Table from 'cli-table2';
import clear from 'clear';
import chalk from 'chalk';

export default new class TerminalWriter {
  colWidth = 10;
  tableOpts = {
    colWidths: [this.colWidth, this.colWidth, this.colWidth, this.colWidth],
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
      , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
      , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
      , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
    colAligns: ['center', 'center', 'center', 'center']
  };

  /**
   * Writes the header, table, instructions and high score
   * @param matrix - table ready array to print
   * @param highScore - the current high score
   */
  writeTable(matrix, highScore = 0) {
    // Create a new table
    clear();
    this._printHeader();
    this._printTable(matrix);
    this._printInstructions();
    this._printHighScore(highScore);
  }

  /**
   * Prints a number of blank lines
   * @param num - how many blank lines to print
   * @private
   */
  _blankLine(num = 1) {
    for (let count = 0; count < num; count++) {
      console.log('');
    }
  }

  /**
   * Prints the instructions
   * @private
   */
  _printInstructions() {
    this._blankLine();
    console.log('Press arrow keys to move. 2 + 2 = 4. Reach 2048');
  }

  /**
   * Prints the game header
   * @private
   */
  _printHeader() {
    console.log(chalk.blue('       =============================='));
    console.log(chalk.blue('-------============ 2048 ============-------'));
    console.log(chalk.blue('       =============================='));
  }

  /**
   * Prints the table
   * @param matrix
   * @private
   */
  _printTable(matrix) {
    const table = new Table(this.tableOpts);
    table.push(...matrix);
    console.log(table.toString());
  }

  /**
   * Prints the high score
   * @param score
   * @private
   */
  _printHighScore(score) {
    this._blankLine();
    console.log(`Current Score: ${chalk.green(score)}`);
  }
}
