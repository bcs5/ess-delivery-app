import { TestBed } from '@angular/core/testing';

import { DelivererService } from './deliverer.service';

describe('DelivererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DelivererService = TestBed.get(DelivererService);
    expect(service).toBeTruthy();
  });
});
