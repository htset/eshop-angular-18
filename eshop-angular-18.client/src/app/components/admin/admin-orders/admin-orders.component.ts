import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { OrderService } from '../../../services/order.service';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  search: string = "";

  constructor(private orderService: OrderService,
    public storeService: StoreService,
    public authenticationService: AuthenticationService) { }

  getOrders(): void {
    this.orderService
      .getOrders(this.storeService.orderPage,
        this.storeService.orderPageSize, this.search)
      .subscribe(orders => {
        this.storeService.orders = orders.value;
        this.storeService.orderCount = orders["@odata.count"];
      });
  }

  onPageChange(newPage: number): void {
    this.storeService.orderPage = newPage;
    this.getOrders();
  }

  onPageSizeChange(): void {
    this.storeService._orderPageSizeSubject
      .next(this.storeService.orderPageSize);
  }

  ngOnInit(): void {
    this.storeService.orderPageSizeChanges$
      .subscribe(newPageSize => {
        this.storeService.orderPage = 1;
        this.getOrders();
      });

    this.getOrders();
  }

  onSearchChange(event: any) {
    this.getOrders();
  }
}
