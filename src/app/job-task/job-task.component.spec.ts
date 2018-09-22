import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTaskComponent } from './job-task.component';

describe('JobTaskComponent', () => {
  let component: JobTaskComponent;
  let fixture: ComponentFixture<JobTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
