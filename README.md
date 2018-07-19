# 2048 Terminal
A small NodeJS application to run in a terminal to play the classic 2048 game.

## Aim
The aim of the game is to reach 2048 by combining numbers together. A user starts with a single '2' in a 4x4 grid.
By pressing the arrow keys (up, down, left, right) the number moves and will combine with any number that is the same.

## Getting Started
`npm install` - Installs dependencies

`npm start` - Starts the application in the terminal
### In game keys:
- Exit - `ctrl + c`
- Move up - `up`
- Move down - `down`
- Move left - `left`
- Move right - `right`
- Restart - `r`

### End game
The game has two end states:
- Winning the game: If one of your cells reaches 2048 then you have won the game. You can continue playing though to see if you can get a higher score
- No possible moves: If you cannot move in any direction then you have lost and will have to restart.


## To do
This application has been written as a bit of fun. There are some things that need to be done:

- Production build
- Unit tests 
