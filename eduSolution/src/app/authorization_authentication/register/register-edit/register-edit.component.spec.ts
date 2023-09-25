import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEditComponent } from './register-edit.component';

describe('AuthorEditComponent', () => {
  let component: RegisterEditComponent;
  let fixture: ComponentFixture<RegisterEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterEditComponent]
    });
    fixture = TestBed.createComponent(RegisterEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
