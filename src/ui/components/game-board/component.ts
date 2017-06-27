import Component, { tracked } from '@glimmer/component';

const SPEED : number = 50; //
const SIZE : number = 40;

interface Snake {
  isMoving : boolean;
  direction : string;
  body : Array<[number, number]>;
}

interface Board {
  food : [number, number];
  rows : Array<any>;
}

export default class GameBoard extends Component {

  @tracked
  board : Board;

  @tracked
  snake : Snake;

  @tracked
  score : number = 0;

  @tracked
  tick : number = 0;

  constructor(options) {
    super(options);
    this.resetTheGame();
    this.beginAcceptingUserInput();
  }

  buildTheGameBoard(size : number = SIZE) : void {
    this.board = {
      rows : Array.from(new Array(size)).map(() => ({
        cells: Array.from(new Array(size)).map(() => ({hasSnake: false}))
      })),
      food: [20, 20]
    };

    this.getCellFromBoard(this.board.food).hasFood = true;
  }

  createTheSnake(origin : [number, number] = [10,10]) : void {
    let originCell = this.getCellFromBoard(origin);
    this.snake = {
      isMoving: false,
      direction: null,
      body: [origin]
    }
    originCell.hasSnake = true;
    this.tick = 0;
  }

  beginAcceptingUserInput() : void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e : any) : void {

    let wasAMovementKey = true;
    switch(e.key) {
      case "ArrowDown":
        if (this.snake.direction !== 'up') this.snake.direction = 'down';
        break;
      case "ArrowUp":
        if (this.snake.direction !== 'down') this.snake.direction = 'up';
        break;
      case "ArrowLeft":
        if (this.snake.direction !== 'right') this.snake.direction = 'left';
        break;
      case "ArrowRight":
        if (this.snake.direction !== 'left') this.snake.direction = 'right';
        break;
      case " ":
        this.snake.isMoving = false;
        wasAMovementKey = false;
        break;
      default:
        wasAMovementKey = false;
        break;
    }

    if (wasAMovementKey && !this.snake.isMoving) {
      this.snake.isMoving = true;
      this.moveTheSnake();
    }
  }

  moveTheSnake() : any {
    if (!this.snake.isMoving) return;

    let head = this.getNextSnakeHead();

    let boundsCollision = (
      head[0] < 0
      || head[1] < 0
      || head[0] >= SIZE
      || head[1] >= SIZE
    );

    // check if hitting the map edge or hitting the body
    if (boundsCollision || this.getCellFromBoard(head).hasSnake) {
      this.snake.isMoving = false;
      return this.resetTheGame();
    }

    this.snake.body.unshift(head); // add the new head
    this.getCellFromBoard(head).hasSnake = true;

    //check if hitting food
    if (head.toString() === this.board.food.toString()) {
      this.eatTheFood();

    // if not eatting food, remove the tail
    } else {
      let tail = this.snake.body.pop();  // remove the old tail
      this.getCellFromBoard(tail).hasSnake = false;
    }


    this.tick = this.tick + 1;

    return setTimeout(this.moveTheSnake.bind(this), this.args.speed);
  }

  eatTheFood() : void {
    // remove the current piece of food
    this.getCellFromBoard(this.board.food).hasFood = false;

    // place a new piece of food
    this.board.food = this.getNewFoodLocation();
    this.getCellFromBoard(this.board.food).hasFood = true;

    this.score = this.score + 1;
  }

  getNewFoodLocation() : [number, number] {
    let row = Math.floor(Math.random() * SIZE);
    let cell = Math.floor(Math.random() * SIZE);
    return [row, cell];
  }

  getCellFromBoard(coords : [number, number]) {
    return this.board.rows[coords[0]].cells[coords[1]];
  }

  getNextSnakeHead() : [number, number] {
    let [row, cell] = this.snake.body[0];
    switch(this.snake.direction) {
      case 'up' :
        return [row - 1, cell];
      case 'right' :
        return [row, cell + 1];
      case 'down' :
        return [row + 1, cell];
      case 'left' :
        return [row, cell - 1];
    }
  }

  equalCoords(a : [number, number], b : [number, number]) {
    return a.toString() === b.toString();
  }

  resetTheGame() : void {
    this.buildTheGameBoard();
    this.createTheSnake();
    this.score = 0;
  }

  willDestroy() : void {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

};
