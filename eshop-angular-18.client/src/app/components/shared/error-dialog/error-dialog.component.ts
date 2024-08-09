import { Component, OnInit, input, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent implements OnInit {

  message = signal("");
  info = signal("");

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
}
