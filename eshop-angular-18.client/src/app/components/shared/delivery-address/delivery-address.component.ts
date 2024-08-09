import { Component, OnInit, model } from '@angular/core';
import { Address } from '../../../models/address';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrl: './delivery-address.component.css'
})
export class DeliveryAddressComponent implements OnInit {

  address = model<Address>();

  addressForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    id: new FormControl(''),
    userId: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
    if (this.address !== undefined) {
      this.addressForm.controls
        .firstName.setValue(this.address()?.firstName || '');
      this.addressForm.controls
        .lastName.setValue(this.address()?.lastName || '');
      this.addressForm.controls
        .street.setValue(this.address()?.street || '');
      this.addressForm.controls
        .zip.setValue(this.address()?.zip || '');
      this.addressForm.controls
        .city.setValue(this.address()?.city || '');
      this.addressForm.controls
        .country.setValue(this.address()?.country || '');
      this.addressForm.controls
        .id.setValue(this.address()?.id.toString() || '0');
      this.addressForm.controls.
        userId.setValue(this.address()?.userId.toString() || '0');
    }
  }

  onSubmit() {
    var addr: Address = {
      firstName: this.addressForm.value.firstName || '',
      lastName: this.addressForm.value.lastName || '',
      street: this.addressForm.value.street || '',
      zip: this.addressForm.value.zip || '',
      city: this.addressForm.value.city || '',
      country: this.addressForm.value.country || '',
      id: parseInt(this.addressForm.value.id || '0'),
      userId: parseInt(this.addressForm.value.userId || '0')
    }

    this.address.set(addr);
  }
}

