import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAttachmentComponent } from './job-attachment.component';

describe('JobAttachmentComponent', () => {
  let component: JobAttachmentComponent;
  let fixture: ComponentFixture<JobAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
