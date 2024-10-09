import { TestBed } from '@angular/core/testing';

import { ReusableComponentsService } from './reusable-components.service';

describe('ReusableComponentsService', () => {
  let service: ReusableComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReusableComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
