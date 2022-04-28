import { TestBed } from '@angular/core/testing';

import { DeliveryManService } from './delivery-man.service';

describe('DeliveryManService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryManService = TestBed.get(DeliveryManService);
    expect(service).toBeTruthy();
  });
});
