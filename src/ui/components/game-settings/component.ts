import Component from '@glimmer/component';

export default class GameSettings extends Component {
  sizes : Array<number> = [6, 10, 20, 30];
  speeds : Array<number> = [500, 250, 100, 25];

  handleChangeSize(event) {
    this.args.changeSize(parseInt(event.target.value));
    document.getElementById('app').focus();
  }

  handleChangeSpeed(event) {
    this.args.changeSpeed(parseInt(event.target.value));
    document.getElementById('app').focus();
  }
};
