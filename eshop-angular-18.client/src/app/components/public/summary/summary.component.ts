import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { User } from '../../../models/user';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  public userInOrder?: User;
  constructor(public storeService: StoreService) { }

  ngOnInit(): void {
  }
}
