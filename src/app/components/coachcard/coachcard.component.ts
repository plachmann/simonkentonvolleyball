import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-coachcard',
  templateUrl: './coachcard.component.html',
  styleUrls: ['./coachcard.component.scss']
})
export class CoachcardComponent {

  @Input() public name: string;
  @Input() public title: string;
  @Input() public bio: string;
  @Input() public image: string;

  constructor() { }
}
