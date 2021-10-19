import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
  @Input() name: string;
  height: number = 180.0;

  constructor() { }

  ngOnInit() {}

  ngOnClick() {
    console.log(`The calculated distance is: ${this.height/2}`);

  }
}
