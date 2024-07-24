import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {

  items:WritableSignal<Item[]> = signal([]);
  count: WritableSignal<number> = signal(0);

  constructor(
    private itemService: ItemService,
    public storeService: StoreService) { }

  ngOnInit(): void {
    this.storeService.pageSizeChanges$
      .subscribe(newPageSize => {
        this.storeService.page = 1;
        this.getItems();
      });

    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems(this.storeService.page,
      this.storeService.pageSize)
      .subscribe(itemPayload => {
        this.items.set(itemPayload.items);
        this.count.set(itemPayload.count);
      });
  }

  onPageChange(newPage: number): void {
    this.storeService.page = newPage;
    this.getItems();
  }

  onPageSizeChange(): void {
    this.storeService._pageSizeSubject.next(this.storeService.pageSize);
  }

}
