import Component, { tracked } from "@glimmer/component";

export default class Snake extends Component {

  difficulties : Array<any> = [
    {name: 'too easy', speed: 300},
    {name: 'slow', speed: 200},
    {name: '"good"', speed: 100},
    {name: 'tricky', speed: 50},
    {name: 'quite hard, actually', speed: 25},
  ];

  @tracked difficulty : string = this.difficulties[2].name;

  @tracked('difficulty')
  get currentDifficulty() {
    return this.difficulties.find(difficulty => difficulty.name === this.difficulty);
  }

  handleChangeDifficulty(event : any) : void {
    this.difficulty = event.target.value;
    document.getElementById('app').focus();
  }
}
