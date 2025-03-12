import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpensesManuallyComponent } from './add-expenses-manually.component';

describe('AddExpensesManuallyComponent', () => {
  let component: AddExpensesManuallyComponent;
  let fixture: ComponentFixture<AddExpensesManuallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpensesManuallyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpensesManuallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
