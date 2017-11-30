import { Component } from '@angular/core';


@Component({
  selector: 'focused-example',
  templateUrl: './focused-example.component.html',
  styleUrls: ['./focused-example.component.scss']
})
export class FocusedExampleComponent {
 
  constructor() {

  }

  public collection = [
    { 
        id: 1,
        text: '1'
    },
    { 
        id: 2,
        text: '2'
    },
    { 
        id: 3,
        text: '4'
    },                                
]; 

  public onSelect(event) {
    //console.log('event', event);
  }
}
