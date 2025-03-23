import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfUserBudgetComponent } from './list-of-user-budget.component';

describe('ListOfUserBudgetComponent', () => {
  let component: ListOfUserBudgetComponent;
  let fixture: ComponentFixture<ListOfUserBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfUserBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfUserBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
