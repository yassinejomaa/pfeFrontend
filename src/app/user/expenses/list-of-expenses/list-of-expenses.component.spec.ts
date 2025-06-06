import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfExpensesComponent } from './list-of-expenses.component';

describe('ListOfExpensesComponent', () => {
  let component: ListOfExpensesComponent;
  let fixture: ComponentFixture<ListOfExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOfExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
