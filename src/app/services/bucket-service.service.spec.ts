import { TestBed } from '@angular/core/testing';

import { BucketServiceService } from './bucket-service.service';

describe('BucketServiceService', () => {
  let service: BucketServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BucketServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
