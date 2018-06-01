import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-playercard',
  templateUrl: './playercard.component.html',
  styleUrls: ['./playercard.component.scss']
})
export class PlayercardComponent {

  @Input() public name: string;
  @Input() public title: string;
  @Input() public bio: string;
  @Input() public image: string;

  constructor() { }
}
