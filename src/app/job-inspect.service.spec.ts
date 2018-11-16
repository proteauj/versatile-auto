import { TestBed, inject } from '@angular/core/testing';

import { JobInspectService } from './job-inspect.service';

describe('JobInspectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobInspectService]
    });
  });

  it('should be created', inject([JobInspectService], (service: JobInspectService) => {
    expect(service).toBeTruthy();
  }));
});
