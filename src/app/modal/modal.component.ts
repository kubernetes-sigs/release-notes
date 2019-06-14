import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  providers: [],
})
export class ModalComponent {
  @Input() title: string;
  @Input() content: string;

  constructor(public activeModal: NgbActiveModal) {}
}
