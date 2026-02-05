import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { State } from '@app/app.reducer';
import { Settings } from '@app/shared/model/settings.model';
import { UpdateSettings } from './settings.actions';
import { getSettingsSelector } from './settings.reducer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
})
export class SettingsComponent implements OnInit, OnDestroy {
  public faCogs = faCogs;
  public settings = new Settings();
  private destroy$ = new Subject<void>();

  /**
   * SettingsComponent's constructor
   */
  constructor(
    private modalService: NgbModal,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.store.pipe(select(getSettingsSelector), takeUntil(this.destroy$)).subscribe(settings => {
      if (settings) {
        this.settings = settings;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Open the modal content
   *
   * @param content to be displayed
   */
  public openModal(content: any): void {
    this.modalService.open(content);
  }

  /**
   * Update the pre-releases setting
   */
  public updatePreReleasesSetting(): void {
    this.store.dispatch(new UpdateSettings(this.settings));
  }
}
