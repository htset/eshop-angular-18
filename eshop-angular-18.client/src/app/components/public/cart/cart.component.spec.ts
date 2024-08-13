import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CartItem } from '../../../models/cartItem';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent],
      imports: [RouterModule.forRoot([]),
      FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    component.storeService.cart.emptyCart();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update item quantity', () => {
    component.storeService.cart.addItem({ quantity: 1, item: { id: 1, name: "a1", price: 1, category: "shoes", description: "" } } as CartItem);
    fixture.detectChanges();

    let quantityTextBox: HTMLInputElement = fixture.debugElement.query(By.css('#quantity')).nativeElement;
    quantityTextBox.value = "3";
    quantityTextBox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.storeService.cart.cartItems[0].quantity).toEqual(3);
  });

  it('should handle error quantity', () => {
    component.storeService.cart.addItem({ quantity: 1, item: { id: 1, name: "a1", price: 1, category: "shoes", description: "" } } as CartItem);
    fixture.detectChanges();

    let quantityTextBox: HTMLInputElement = fixture.debugElement.query(By.css('#quantity')).nativeElement;
    quantityTextBox.value = "3a";
    quantityTextBox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.storeService.cart.cartItems[0].quantity).toEqual(0);
    expect(fixture.debugElement.query(By.css('#checkout')).nativeElement.getAttribute("disabled")).toEqual('');

    quantityTextBox.value = "";
    quantityTextBox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.storeService.cart.cartItems[0].quantity).toEqual(0);
    expect(fixture.debugElement.query(By.css('#checkout')).nativeElement.getAttribute("disabled")).toEqual('');

    quantityTextBox.value = "-1";
    quantityTextBox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.storeService.cart.cartItems[0].quantity).toEqual(0);
    expect(fixture.debugElement.query(By.css('#checkout')).nativeElement.getAttribute("disabled")).toEqual('');

    quantityTextBox.value = "3";
    quantityTextBox.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.storeService.cart.cartItems[0].quantity).toEqual(3);
    expect(fixture.debugElement.query(By.css('#checkout')).nativeElement.getAttribute("disabled")).toBeNull();
  });

  it('should delete item', () => {
    component.storeService.cart.addItem({ quantity: 1, item: { id: 1, name: "a1", price: 1, category: "shoes", description: "" } } as CartItem);
    fixture.detectChanges();
    expect(component.storeService.cart.cartItems.length).toEqual(1);

    //alternative way to get element (by text)
    let removeButton: HTMLInputElement = fixture.debugElement.query(By.css('input[value="Remove"]')).nativeElement;
    removeButton.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.storeService.cart.cartItems.length).toEqual(0);
  });

  it('should have disabled Checkout and Empty buttons when Cart is empty', () => {
    expect(component.storeService.cart.cartItems.length).toEqual(0);
    expect(fixture.debugElement.query(By.css('#checkout')).nativeElement.getAttribute("disabled")).toEqual('');
    expect(fixture.debugElement.query(By.css('#empty')).nativeElement.getAttribute("disabled")).toEqual('');

    component.storeService.cart.addItem({ quantity: 1, item: { id: 1, name: "a1", price: 1, category: "shoes", description: "" } } as CartItem);
    fixture.detectChanges();

    expect(component.storeService.cart.cartItems.length).toEqual(1);
    expect(fixture.debugElement.query(By.css('#checkout')).nativeElement.getAttribute("disabled")).toBeNull();
    expect(fixture.debugElement.query(By.css('#empty')).nativeElement.getAttribute("disabled")).toBeNull();
  });

});
