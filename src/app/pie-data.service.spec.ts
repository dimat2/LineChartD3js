import { TestBed } from '@angular/core/testing';

import { PieDataService } from './pie-data.service';

describe('PieDataService', () => {
  let service: PieDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
