import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

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

  constructor() { }
}
