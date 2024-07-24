import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StoreService } from './services/store.service';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
 
  constructor(
    public storeService: StoreService
  ) { }

  ngOnInit() {}

  title = 'eshop-angular-18.client';
}
