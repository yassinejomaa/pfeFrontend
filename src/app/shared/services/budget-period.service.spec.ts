import { TestBed } from '@angular/core/testing';

import { BudgetPeriodService } from './budget-period.service';

describe('BudgetPeriodService', () => {
  let service: BudgetPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
