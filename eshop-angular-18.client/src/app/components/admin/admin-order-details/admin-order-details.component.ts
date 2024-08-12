import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../../app/models/order';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-order-details',
  templateUrl: './admin-order-details.component.html',
  styleUrls: ['./admin-order-details.component.css']
})
export class AdminOrderDetailsComponent implements OnInit {

  order: Order = { id: 0 };

  constructor(private route: ActivatedRoute,
    private orderService: OrderService) { }

  getOrder(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService
      .getOrder(id)
      .subscribe(order => {
        this.order = order;
      });
  }

  ngOnInit(): void {
    this.getOrder();
  }
}
