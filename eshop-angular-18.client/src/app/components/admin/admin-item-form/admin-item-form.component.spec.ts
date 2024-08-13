import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminItemFormComponent } from './admin-item-form.component';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AdminItemFormComponent', () => {
  let component: AdminItemFormComponent;
  let fixture: ComponentFixture<AdminItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminItemFormComponent],
      imports: [RouterModule.forRoot([]),
        FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
