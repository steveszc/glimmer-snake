import Component, { tracked } from '@glimmer/component';

interface Board {
  food : [number, number];
  rows : Array<any>;
}

export default class GameBoard extends Component {

  @tracked
  board : Board;

  @tracked
  snake : Array<[number, number]>;

  @tracked
  score : number = 0;

  @tracked
  isMovingSnake : boolean = false;

  size = null;

  constructor(options) {
    super(options);
    this.size = this.args.size;
    this.resetTheGame();
  }

  didUpdate() {
    if (this.size !== this.args.size) {
      this.size = this.args.size;
      return this.resetTheGame();
    }
    if (this.args.isPaused || this.isMovingSnake) return;
    else this.moveTheSnake();
  }

  buildTheGameBoard() {
    this.board = {
      rows : Array.from(new Array(this.args.size)).map(() => ({
        cells: Array.from(new Array(this.args.size)).map(() => ({hasSnake: false}))
      })),
      food: this.getRandomCoords()
    };

    this.getCellFromBoard(this.board.food).hasFood = true;
  }

  createTheSnake(body : Array<[number, number]> = [this.getRandomCoords()]) {
    let cells = body.map(cell => this.getCellFromBoard(cell));
    this.snake = body;
    cells.forEach(cell => cell.hasSnake = true);
    this.args.resetTick();
  }

  moveTheSnake() : any {
    // early return if game is paused
    if (this.args.isPaused) return this.isMovingSnake = false;
    else this.isMovingSnake = true;

    // The coords for the new snake head
    let headCoords : [number, number] = this.getNextSnakeHead();

    // is the snake hitting a piece of food?
    let foodCollision : boolean = this.coordsAreEqual(headCoords, this.board.food);

    // Is the snake hitting the edge of the board?
    let boundsCollision : boolean = (
      headCoords[0] < 0
      || headCoords[1] < 0
      || headCoords[0] >= this.args.size
      || headCoords[1] >= this.args.size
    );

    // is the snake 1 cell, or 2+ cells?
    let snakeHasLength : boolean = this.snake.length > 1;

    // Snake is 2+ cells :
    // Handle tail moving before the head is added
    // tail doesn't move if food is being eaten
    if (snakeHasLength && !foodCollision) this.removeTheSnakeTail();

    // Second, restart the game if collision
    // boundsCollision come first and short circuits in case next head is off board
    if (boundsCollision || this.getCellFromBoard(headCoords).hasSnake) {
      return this.resetTheGame();
    }

    // Third, add the new head to the snake
    this.addTheSnakeHead(headCoords);

    // Snake is 1 cell :
    // Handle tail moving after the head is added
    // tail doesn't move if food is being eaten
    if (!snakeHasLength && !foodCollision) this.removeTheSnakeTail();

    // Handle eating a piece of food
    if (foodCollision) this.eatTheFood();

    // If there is a direction queue, dequeue to first direction in the queue
    if (this.args.directionQueue.length > 1) this.args.dequeueDirection();

    // Lastly, increment the game tick and schedule the next movement
    this.args.incrementTick();
    return setTimeout(this.moveTheSnake.bind(this), this.args.speed);
  }

  eatTheFood() : void {
    let newFoodCoords = this.getEmptyCoords();
    // remove the current piece of food
    this.getCellFromBoard(this.board.food).hasFood = false;

    // place a new piece of food on the board
    this.board.food = newFoodCoords;
    this.getCellFromBoard(newFoodCoords).hasFood = true;

    // increment the game score
    this.score = this.score + 1;
  }

  getRandomCoords() : [number, number] {
    let row = Math.floor(Math.random() * this.args.size);
    let cell = Math.floor(Math.random() * this.args.size);
    return [row, cell];
  }

  getEmptyCoords() : [number, number] {
    let occupiedCoords = this.snake.concat(this.board.food);
    let randomCoords = this.getRandomCoords();
    let randomIsOccupied = occupiedCoords.some(coord => this.coordsAreEqual(coord, randomCoords));
    return !randomIsOccupied ? randomCoords : this.getEmptyCoords();
  }

  getCellFromBoard(coords : [number, number]) {
    return this.board.rows[coords[0]].cells[coords[1]];
  }

  getNextSnakeHead() : [number, number] {
    let [row, cell] = this.snake[0];
    switch(this.args.directionQueue[0]) {
      case 0 :
        return [row - 1, cell];
      case 90 :
        return [row, cell + 1];
      case 180 :
        return [row + 1, cell];
      case 270 :
        return [row, cell - 1];
    }
  }

  removeTheSnakeTail() {
    let tail : [number, number] = this.snake[this.snake.length - 1];
    this.snake = this.snake.slice(0, -1); // remove the tail
    let tailCell = this.getCellFromBoard(tail);
    tailCell.hasSnake = false;
    tailCell.direction = null;
  }

  addTheSnakeHead(head : [number, number]) {
    // add the new head to the snake
    this.snake = [head].concat(this.snake);

    // update the head cell on the board
    let headCell = this.getCellFromBoard(head);
    headCell.hasSnake = true;
    headCell.isHead = true;
    headCell.direction = this.args.directionQueue[0].toString();

    //update the old head cell on the board
    let prevHeadCell = this.getCellFromBoard(this.snake[1]);
    prevHeadCell.direction = this.args.directionQueue[0].toString();
    prevHeadCell.isHead = false;
  }

  coordsAreEqual(a : [number, number], b : [number, number]) : boolean {
    return a.toString() === b.toString();
  }

  resetTheGame() : void {
    this.buildTheGameBoard();
    this.createTheSnake();
    this.args.dequeueAllDirection();
    this.args.pauseTheGame();
    this.score = 0;
    this.isMovingSnake = false;
  }

};
