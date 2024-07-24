import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Filter } from '../models/filter';
import { Cart } from '../models/cart';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private readonly _page = new BehaviorSubject<number>(1);
  readonly page$ = this._page.asObservable();

  get page(): number {
    return this._page.getValue();
  }

  set page(val: number) {
    this._page.next(val);
  }

  public pageSize: number = 3;
  public readonly _pageSizeSubject = new Subject<number>();
  public pageSizeChanges$ = this._pageSizeSubject.asObservable(); 

  private readonly _filter = new BehaviorSubject<Filter>({ name: "", categories: [] });
  readonly filter$ = this._filter.asObservable();

  get filter(): Filter {
    return this._filter.getValue();
  }

  set filter(val: Filter) {
    this._filter.next(val);
  }

  private readonly _cart = new BehaviorSubject<Cart>(new Cart());
  readonly cart$ = this._cart.asObservable();

  get cart(): Cart {
    return this._cart.getValue();
  }

  set cart(val: Cart) {
    this._cart.next(val);
  }

  constructor() { }
}
