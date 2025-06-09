import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeviewComponent } from './timeview.component';

describe('TimeviewComponent', () => {
  let component: TimeviewComponent;
  let fixture: ComponentFixture<TimeviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TimeviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
