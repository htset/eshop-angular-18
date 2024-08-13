import { TestBed } from '@angular/core/testing';

import { LoadingDialogService } from './loading-dialog.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoadingDialogService', () => {
  let service: LoadingDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(LoadingDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
