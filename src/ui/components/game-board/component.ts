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
  tick : number = 0;

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
    this.tick = 0;
  }

  moveTheSnake() : any {
    if (this.args.isPaused) return this.isMovingSnake = false;

    this.isMovingSnake = true;

    let head = this.getNextSnakeHead();

    let boundsCollision = (
      head[0] < 0
      || head[1] < 0
      || head[0] >= this.args.size
      || head[1] >= this.args.size
    );

    // check if hitting the map edge or hitting the body
    if (boundsCollision || this.getCellFromBoard(head).hasSnake) {
      this.args.pauseTheGame();
      this.isMovingSnake = false;
      return this.resetTheGame();
    }

    this.snake.unshift(head); // add the new head
    let headCell = this.getCellFromBoard(head);
    headCell.hasSnake = true;
    headCell.isHead = true;
    headCell.direction = this.args.direction.toString();

    //set the direction to the new head on the old head for styling
    let prevHeadCell = this.getCellFromBoard(this.snake[1]);
    prevHeadCell.direction = this.args.direction.toString();
    prevHeadCell.isHead = false;

    //check if hitting food
    if (head.toString() === this.board.food.toString()) {
      this.eatTheFood();

    // if not eatting food, remove the tail
    } else {
      let tail = this.snake.pop();  // remove the old tail
      let tailCell = this.getCellFromBoard(tail);
      tailCell.hasSnake = false;
      tailCell.direction = null;
    }

    this.tick = this.tick + 1;

    return setTimeout(this.moveTheSnake.bind(this), this.args.speed);
  }

  eatTheFood() : void {
    // remove the current piece of food
    this.getCellFromBoard(this.board.food).hasFood = false;

    // place a new piece of food
    this.board.food = this.getEmptyCoords();
    this.getCellFromBoard(this.board.food).hasFood = true;

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
    switch(this.args.direction) {
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

  coordsAreEqual(a : [number, number], b : [number, number]) : boolean {
    return a.toString() === b.toString();
  }

  resetTheGame() : void {
    this.buildTheGameBoard();
    this.createTheSnake();
    //this.createTheSnake([[10,10], [10,11], [11,11], [11,12]]);
    this.score = 0;
  }

};
