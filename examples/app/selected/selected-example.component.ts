import { Component } from '@angular/core';


@Component({
  selector: 'selected-example',
  templateUrl: './selected-example.component.html',
  styleUrls: ['./selected-example.component.scss']
})
export class SelectedExampleComponent {
  public items: any[] = [{
    id: '1',
    title: "Banana",
  },
  {
    id: '2',
    title: "Pineapple",
  },
  {
    id: '3',
    title: "Apple",
  },
  {
    id: '4',
    title: "Carrot",
  },
  {
    id: '5',
    title: "Tomato",
  },
  {
    id: '6',
    title: "Potato",
  },
  {
    id: '7',
    title: "Cucumber",
  },
  {
    id: '8',
    title: "Radish",
  }, {
    id: '1',
    title: "Banana",
  },
  {
    id: '2',
    title: "Pineapple",
  },
  {
    id: '3',
    title: "Apple",
  },
  {
    id: '4',
    title: "Carrot",
  },
  {
    id: '5',
    title: "Tomato",
  },
  {
    id: '6',
    title: "Potato",
  },
  {
    id: '7',
    title: "Cucumber",
  },
  {
    id: '8',
    title: "Radish",
  }]
  constructor() {

  }

  public onSelect(event) {
    //console.log('event', event);
  }
}
