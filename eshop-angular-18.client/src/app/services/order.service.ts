import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  addOrder(order: Order) {
    return this.http
      .post<Order>(`${environment.apiUrl}/orders`, order);
  }

  getOrders(page: number, pageSize: number, search: string)
    : Observable<any> {

    let params = new HttpParams();

    if (page > 1)
      params = params.set("$skip", ((page - 1) * pageSize).toString())

    params = params.set("$count", "true")
    params = params.set("$top", pageSize.toString());

    if (search != "")
      params = params.set("$filter", "contains(firstName,'" + search
        + "') or contains(lastName,'" + search
        + "') or contains(city,'" + search + "')");

    return this.http
      .get<any>(`${environment.oDataUrl}/orders`, { params: params })
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http
      .get<Order>(`${environment.apiUrl}/orders/${orderId}`);
  }
}
