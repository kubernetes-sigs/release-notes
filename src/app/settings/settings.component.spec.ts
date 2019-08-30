import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { SettingsComponent } from '@app/settings/settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [NgbModal, NgbActiveModal],
      imports: [FontAwesomeModule, FormsModule, NgbModule, StoreModule.forRoot({})],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to toggle the pre release setting', () => {
    component.togglePreReleasesSetting();
    expect(component.settings.displayPreReleases).toBeTruthy();
  });
});
