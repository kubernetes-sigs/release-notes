import { Component } from '@angular/core';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducer';
import { Settings } from '@app/shared/model/settings.model';
import { UpdateSettings } from './settings.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  public faCogs = faCogs;
  public settings = new Settings();

  /**
   * SettingsComponent's constructor
   */
  constructor(private modalService: NgbModal, private store: Store<State>) {}

  /**
   * Open the modal content
   *
   * @param content to be displayed
   */
  public openModal(content: any): void {
    this.modalService.open(content);
  }

  /**
   * Toggle the pre-releases setting
   */
  public togglePreReleasesSetting(): void {
    this.settings.displayPreReleases = !this.settings.displayPreReleases;
    this.store.dispatch(new UpdateSettings(this.settings));
  }
}
