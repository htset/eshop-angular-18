import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAddressComponent } from './delivery-address.component';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('DeliveryAddressComponent', () => {
  let component: DeliveryAddressComponent;
  let fixture: ComponentFixture<DeliveryAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryAddressComponent],
      imports: [RouterModule.forRoot([]),
        ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
