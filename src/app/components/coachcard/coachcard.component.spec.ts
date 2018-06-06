import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachcardComponent } from './coachcard.component';

describe('CoachcardComponent', () => {
  let component: CoachcardComponent;
  let fixture: ComponentFixture<CoachcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoachcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoachcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
