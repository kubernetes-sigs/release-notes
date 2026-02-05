import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let mockActiveModal: any;

  beforeEach(async () => {
    mockActiveModal = {
      close: jest.fn(),
      dismiss: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: mockActiveModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty title and content', () => {
    expect(component.title).toBe('');
    expect(component.content).toBe('');
  });

  it('should accept title input', () => {
    component.title = 'Test Title';
    expect(component.title).toBe('Test Title');
  });

  it('should accept content input', () => {
    component.content = 'Test Content';
    expect(component.content).toBe('Test Content');
  });

  it('should have access to activeModal', () => {
    expect(component.activeModal).toBe(mockActiveModal);
  });
});
