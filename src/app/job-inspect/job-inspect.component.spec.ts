import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInspectComponent } from './job-inspect.component';

describe('JobInspectComponent', () => {
  let component: JobInspectComponent;
  let fixture: ComponentFixture<JobInspectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInspectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
