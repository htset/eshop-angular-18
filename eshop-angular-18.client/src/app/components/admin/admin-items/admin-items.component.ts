import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { skip } from 'rxjs/operators';
import { Item } from '../../../../app/models/item';
import { AuthenticationService } from '../../../../app/services/authentication.service';
import { ItemService } from '../../../../app/services/item.service';
import { StoreService } from '../../../../app/services/store.service';
import { environment } from '../../../../environments/environment';
import { FilterComponent } from '../../shared/filter/filter.component';

@Component({
  selector: 'app-admin-items',
  templateUrl: './admin-items.component.html',
  styleUrls: ['./admin-items.component.css']
})
export class AdminItemsComponent implements OnInit {

  imageUrl: string = environment.imagesUrl;

  constructor(private itemService: ItemService,
    public storeService: StoreService,
    public authenticationService: AuthenticationService,
    private modalService: NgbModal) { }

  getItems(): void {
    this.itemService
      .getItems(this.storeService.page,
        this.storeService.pageSize, this.storeService.filter)
      .subscribe(itemPayload => {
        this.storeService.items = itemPayload.items;
        this.storeService.count = itemPayload.count;
      });
  }

  delete(item: Item): void {
    this.itemService.deleteItem(item)
      .subscribe(item => {
        this.storeService.page = 1;
        this.getItems();
      });
  }

  openFilter() {
    this.modalService.open(FilterComponent);
  }

  onPageChange(newPage: number): void {
    this.storeService.page = newPage;
    this.getItems();
  }

  onPageSizeChange(): void {
    this.storeService._pageSizeSubject.next(this.storeService.pageSize);
  }

  ngOnInit(): void {
    this.storeService.pageSizeChanges$
      .subscribe(newPageSize => {
        console.log('new page size:' + this.storeService.pageSize);
        this.storeService.page = 1;
        this.getItems();
      });

    this.storeService.filter$
      .pipe(skip(1))    //skip getting filter at component creation
      .subscribe(newFilter => {
        this.storeService.page = 1;
        this.getItems();
      });

    this.getItems();
  }
}
