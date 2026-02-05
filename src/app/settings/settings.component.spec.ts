import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { SettingsComponent } from '@app/settings/settings.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [NgbModal, provideStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should succeed to update the pre release setting', () => {
    component.settings.displayPreReleases = true;
    component.updatePreReleasesSetting();
    expect(component.settings.displayPreReleases).toBeTruthy();
  });
});
