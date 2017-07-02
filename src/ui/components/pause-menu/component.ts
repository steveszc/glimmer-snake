import Component from '@glimmer/component';

export default class PauseMenu extends Component {
  sizes : Array<number> = [10, 20, 30, 40, 50];
  speeds : Array<number> = [300, 200, 100, 50, 25];

  handleChangeSize(event) {
    this.args.changeSize(parseInt(event.target.value));
    document.getElementById('app').focus();
  }

  handleChangeSpeed(event) {
    this.args.changeSpeed(parseInt(event.target.value));
    document.getElementById('app').focus();
  }
};
