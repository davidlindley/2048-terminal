import keypress from 'keypress';

export default class KeyHandler {

  actions = [];

  /**
   * Register actions
   * @param actions
   */
  constructor(...actions) {
    this.actions = actions;
    this._registerKeypress();
  }

  /**
   * Register the keypresses
   * @private
   */
  _registerKeypress() {
    keypress(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', (chunk, key) => {
      // Ensure we can still exit
      if (key && key.ctrl && key.name == 'c') process.exit();
      // Check if there is an action for the key
      const action = this.actions.filter((action) => {
        return action.key === key.name;
      });
      if (action.length) {
        action[0].action();
      }
    });
  }

}
