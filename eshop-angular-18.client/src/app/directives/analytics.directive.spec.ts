import { Component } from '@angular/core';
import { AnalyticsDirective } from './analytics.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<input type="button"
             id="test" value="Test"
             appAnalytics events="click" />`
})
class TestComponent {
}

describe('AnalyticsDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let originalLog: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsDirective
        , TestComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    originalLog = console.log;
    spyOn(console, 'log');
  });

  afterEach(() => {
    // Restore the original console.log after each test
    console.log = originalLog; 
  });

  it('should create an instance', () => {
    let el: HTMLButtonElement = fixture.debugElement
      .query(By.css('#test')).nativeElement;
    el.dispatchEvent(new Event("click"));
    fixture.detectChanges();

    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Event: click");
  });
});
