import { Component } from '@angular/core';


@Component({
  selector: 'draggable-example',
  templateUrl: './draggable-example.component.html',
  styleUrls: ['./draggable-example.component.scss']
})
export class DraggableExampleComponent {
 
  constructor() {

  }

  public onSelect(event) {
    //console.log('event', event);
  }
}
