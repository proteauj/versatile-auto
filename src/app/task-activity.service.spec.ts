import { TestBed } from '@angular/core/testing';

import { TaskActivityService } from './task-activity.service';

describe('TaskActivityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskActivityService = TestBed.get(TaskActivityService);
    expect(service).toBeTruthy();
  });
});
