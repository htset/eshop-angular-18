import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../../../app/models/item';
import { ItemService } from '../../../../app/services/item.service';
import { Location } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../../app/services/image.service';
import { Image } from '../../../../app/models/image';


@Component({
  selector: 'app-admin-item-form',
  templateUrl: './admin-item-form.component.html',
  styleUrls: ['./admin-item-form.component.css']
})
export class AdminItemFormComponent implements OnInit {

  @ViewChild('itemForm') public itemForm?: NgForm;
  categories: string[] = ["", "Shoes", "Clothes", "Glasses"];
  mode = signal<string>("new");
  item = signal<Item>({ id: 0, name: "", price: 0, category: "", description: "" });
  public progress = signal<number>(0);
  public message = signal<string>('');
  success = signal<boolean>(false);
  submitted = signal<boolean>(false);
  imageLink = signal<string>('');
  image?: Image;

  constructor(
    private route: ActivatedRoute,
    public itemService: ItemService,
    private location: Location,
    private router: Router,
    private imageService: ImageService
  ) { }

  ngOnInit(): void {
    this.getItem();
  }

  onSubmit(): void {
    if (this.item().id > 0) {
      this.itemService.updateItem(this.item())
        .subscribe({
          next: () => {
            this.itemForm?.form.markAsPristine();
            this.success.set(true);
            this.submitted.set(true);
          },
          error: () => {
            this.success.set(false);
            this.submitted.set(true);
          }
        });
    }
    else {
      this.itemService.addItem(this.item())
        .subscribe((item) => {
          this.item.set(item);
          this.itemForm?.form.markAsPristine();
        });
    }
  }

  getItem(): void {
    if (this.route.snapshot.paramMap.get('id') === 'undefined'
      || this.route.snapshot.paramMap.get('id') === null
      || Number(this.route.snapshot.paramMap.get('id')) === 0) {

      this.item.set({ id: 0, name: "", price: 0, category: "", description: "" });
    }
    else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id > 0) {
        this.itemService.getItem(id)
          .subscribe((item) => {
            this.item.set(item);
            let imagesArray = this.item()?.images;
            if (imagesArray !== undefined)
              this.imageLink.set(`${environment.imagesUrl}/`
                + imagesArray[0]?.fileName + '?' + Math.random());
          });
      }
      else {
        this.router.navigate(['/404']);
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      let fileExtension = file.name.split('?')[0].split('.').pop();
      this.image = new Image(this.item().id,
        file.type, file, this.item().id.toString() + '.' + fileExtension);

      this.imageService.upload(this.image)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress.set(Math.round(100 * event.loaded / (event.total || 1)));
          else if (event.type === HttpEventType.Response) {
            this.message.set('Upload success.');
            this.updateImageLink();
          }
        });
    });
    reader.readAsDataURL(file);
  }

  public updateImageLink() {
    this.imageLink.set(`${environment.imagesUrl}/`
      + this.image?.fileName + '?' + Math.random());
  }
}
