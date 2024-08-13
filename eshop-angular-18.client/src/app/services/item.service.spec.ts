import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ItemPayload } from '../models/itemPayload';
import { Filter } from '../models/filter';
import { Item } from '../models/item';

describe('ItemService', () => {
  let service: ItemService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ItemService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("get items", () => {
    let expectedItemPayload: ItemPayload = {
      items: [
        { id: 1, name: "aa", price: 11, category: "shoes", description: "xxxxx" },
        { id: 2, name: "bb", price: 11, category: "clothes", description: "xxxxx" }
      ],
      count: 2
    };
    let filter: Filter = { name: "", categories: [] };

    it("should return items", () => {
      service.getItems(1, 3, filter)
        .subscribe(
          itemPayload => expect(itemPayload).toEqual(expectedItemPayload)
        );

      const req = httpTestingController.expectOne(service.itemsUrl + "?name=&pageNumber=1&pageSize=3&category=");
      expect(req.request.method).toEqual('GET');

      req.flush(expectedItemPayload);
    });

    it("should be ok returning no items", () => {
      let expectedItemPayload: ItemPayload = { items: [], count: 0 };
      service.getItems(1, 3, filter)
        .subscribe(
          itemPayload => {
            expect(itemPayload.count).toEqual(0);
            expect(itemPayload.items).toEqual([]);
          }
        );

      const req = httpTestingController.expectOne(service.itemsUrl + "?name=&pageNumber=1&pageSize=3&category=");
      expect(req.request.method).toEqual('GET');

      req.flush(expectedItemPayload);
    });

    it('should return expected items (called multiple times)', () => {

      service.getItems(1, 3, filter).subscribe();
      service.getItems(1, 3, filter).subscribe();
      service.getItems(1, 3, filter).subscribe(
        itemP => expect(itemP)
          .withContext('should return expected Items')
          .toEqual(expectedItemPayload)
      );

      const requests = httpTestingController.match(service.itemsUrl + "?name=&pageNumber=1&pageSize=3&category=");
      expect(requests.length)
        .withContext('calls to getItems()')
        .toEqual(3);

      // Respond to each request with different mock item results
      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'bob' }]);
      requests[2].flush(expectedItemPayload);
    });

  });

  describe('#updateItem', () => {
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${service.itemsUrl}/?id=${id}`;

    it('should update an item and return it', () => {

      const updateItem: Item = { id: 5, name: 'A', price: 1, category: "", description: "bb" };

      service.updateItem(updateItem).subscribe(
        data => expect(data)
          .withContext('should return the item')
          .toEqual(updateItem)
      );

      // service should have made one request to PUT item
      const req = httpTestingController.expectOne(service.itemsUrl + '/5');
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateItem);

      // Expect server to return the item after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateItem });
      req.event(expectedResponse);
    });

  });
});
