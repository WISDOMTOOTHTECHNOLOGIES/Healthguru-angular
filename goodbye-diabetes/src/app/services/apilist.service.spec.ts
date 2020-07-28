import { TestBed } from '@angular/core/testing';

import { ApilistService } from './apilist.service';

describe('ApilistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApilistService = TestBed.get(ApilistService);
    expect(service).toBeTruthy();
  });
});
