import Component from '@glimmer/component';

export default class UserInput extends Component {

  /*
   * Tick and didPressMovementKeyDuringTick are tracked so that
   * rapid keypresses that occur within the same tick can be handled.
   * Multiple keypresses within the same tick are queued for execution
   * in a subsequent tick.
   * The first keypress in a tick replaces the entire queue
   * to provide snappy feel to user input input
   */

  tick = 0;
  didPressMovementKeyDuringTick = false;

  constructor(options) {
    super(options);
    this.beginAcceptingUserInput();
  }

  didUpdate() {
    // set up a new tick
    if (this.args.tick !== this.tick) {
      this.tick = this.args.tick;
      this.didPressMovementKeyDuringTick = false;
    }
  }

  willDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  beginAcceptingUserInput() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  handleKeyDown(e : any) {
    let wasAMovementKey = true;
    let direction = this.args.directionQueue[this.args.directionQueue.length-1];
    switch(e.which) {
      case 38: // ↑
      case 87: // w
        if (direction !== 180) {
          this.didPressMovementKeyDuringTick
            ? this.args.queueDirection(0)
            : this.args.replaceDirection(0);
        }
        break;
      case 39: // →
      case 68: // d
        if (direction !== 270) {
          this.didPressMovementKeyDuringTick
            ? this.args.queueDirection(90)
            : this.args.replaceDirection(90);
        }
        break;
      case 40: // ↓
      case 83: // s
        if (direction !== 0) {
          this.didPressMovementKeyDuringTick
            ? this.args.queueDirection(180)
            : this.args.replaceDirection(180);
        }
        break;
      case 37: // ←
      case 65: // a
        if (direction !== 90) {
          this.didPressMovementKeyDuringTick
            ? this.args.queueDirection(270)
            : this.args.replaceDirection(270);
        }
        break;
      case 32: // space
        this.args.pauseTheGame();
        //fallthrough
      default:
        wasAMovementKey = false;
        break;
    }

    if (wasAMovementKey) {
      this.didPressMovementKeyDuringTick = true;
      e.preventDefault();
    }

    if (wasAMovementKey && this.args.isPaused) {
      this.args.startTheGame();
    }
  }

};
