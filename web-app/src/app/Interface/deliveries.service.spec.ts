import { TestBed } from '@angular/core/testing';

import { DeliveriesService } from './deliveries.service';

describe('DeliveriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveriesService = TestBed.get(DeliveriesService);
    expect(service).toBeTruthy();
  });
});
