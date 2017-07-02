import Component, { tracked } from "@glimmer/component";

export default class Snake extends Component {

  @tracked state = {
    size: 20,
    speed: 100,
    direction: null,
    isPaused: true
  }

  changeSize(size : number) {
    this.state = { ...this.state, size };
  }

  changeSpeed(speed : number) {
    this.state = { ...this.state, speed };
  }

  changeDirection(direction : number) {
    this.state = { ...this.state, direction };
  }

  changeIsPaused(isPaused : boolean) {
    this.state = { ...this.state, isPaused };
  }
}
