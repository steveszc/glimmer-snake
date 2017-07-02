import Component from '@glimmer/component';

export default class UserInput extends Component {

  constructor(options) {
    super(options);
    this.beginAcceptingUserInput();
  }

  willDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  beginAcceptingUserInput() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e : any) {
    let wasAMovementKey = true;
    switch(e.key) {
      case "ArrowDown":
        if (this.args.direction !== 0) this.args.changeDirection(180);
        break;
      case "ArrowUp":
        if (this.args.direction !== 180) this.args.changeDirection(0);
        break;
      case "ArrowLeft":
        if (this.args.direction !== 90) this.args.changeDirection(270);
        break;
      case "ArrowRight":
        if (this.args.direction !== 270) this.args.changeDirection(90);
        break;
      case " ":
        this.args.pauseTheGame();
        //fallthrough
      default:
        wasAMovementKey = false;
        break;
    }

    if(wasAMovementKey) {
      e.preventDefault();
    }

    if (wasAMovementKey && this.args.isPaused) {
      this.args.startTheGame();
    }
  }

};
