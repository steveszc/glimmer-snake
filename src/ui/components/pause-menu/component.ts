import Component from '@glimmer/component';

export default class PauseMenu extends Component {
  speeds : Array<number> = [300, 200, 100, 50, 25];

  handleChangeSpeed(event) {
    this.args.changeSpeed(event.target.value);
    document.getElementById('app').focus();
  }
};
