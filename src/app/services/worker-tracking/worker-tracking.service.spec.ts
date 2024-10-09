import { TestBed } from '@angular/core/testing';

import { WorkerTrackingService } from './worker-tracking.service';

describe('WorkerTrackingService', () => {
  let service: WorkerTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
