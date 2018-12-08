import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInspectDialogComponent } from './job-inspect-dialog.component';

describe('JobInspectDialogComponent', () => {
  let component: JobInspectDialogComponent;
  let fixture: ComponentFixture<JobInspectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInspectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInspectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
