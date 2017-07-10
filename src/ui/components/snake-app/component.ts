import Component, { tracked } from "@glimmer/component";

export default class Snake extends Component {

  @tracked state = {
    size: 10,
    speed: 200,
    directionQueue: [],
    isPaused: true
  }

  @tracked tick : number = 0;

  didInsertElement() {
    let loader = <HTMLElement>document.querySelector('.loader');
    loader && loader.classList.add('loader--is-loaded');
  }

  changeSize(size : number) {
    this.state = { ...this.state, size };
  }

  changeSpeed(speed : number) {
    this.state = { ...this.state, speed };
  }

  queueDirection(direction : number) {
    this.state = {
      ...this.state,
      directionQueue: this.state.directionQueue.concat(direction)
    }
  }

  replaceDirection(direction : number) {
    this.state = {
      ...this.state,
      directionQueue: [direction]
    }
  }

  dequeueDirection(direction : number) {
    this.state = {
      ...this.state,
      directionQueue: this.state.directionQueue.slice(1)
    }
  }

  dequeueAllDirection() {
    this.state = { ...this.state, directionQueue: [] };
  }

  changeIsPaused(isPaused : boolean) {
    this.state = { ...this.state, isPaused };
  }

  incrementTick() {
    this.tick += 1;
  }

  resetTick() {
    this.tick = 0;
  }
}
