import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../services/item.service';
import { Item } from '../../../models/item';
import { StoreService } from '../../../services/store.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css'
})
export class ItemDetailsComponent implements OnInit {

  item: Item = { id: 0, name: "", price: 0, category: "", description: "" };
  imageLink: string = '';

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getItem();
  }

  getItem(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.getItem(id)
      .subscribe((item) => {
        this.item = item;
        let imagesArray = this.item?.images;
        if (imagesArray !== undefined)
          this.imageLink = `${environment.imagesUrl}/`
            + imagesArray[0]?.fileName + '?' + Math.random();
      });
  }

  addToCart(): void {
    this.storeService.cart.addItem({ item: this.item, quantity: 1 });
    this.router.navigate(['/cart']);
  }

}
