import { Component, ViewChild } from '@angular/core';
import { Note } from '@app/notes/notes.model';
import { Filter, Options } from '@app/shared/model/options.model';
import { NotesComponent } from '@app/notes/notes.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  options: Options = new Options();
  filter: Filter = new Filter();
  @ViewChild(NotesComponent) noteChild;

  constructor() {}

  updateFilterString(a, b): void {
    if (b.length > 0) {
      this.filter[a] = b;
    } else {
      this.filter[a] = '';
    }
    this.noteChild.update(this.filter);
  }

  updateFilterObject(a, b, val): void {
    if (val) {
      this.filter[a][b] = val;
    } else {
      delete this.filter[a][b];
    }
    this.noteChild.update(this.filter);
  }

  gotNotes(notes: Note[]): void {
    for (const note of Object.values(notes)) {
      if ('areas' in note) {
        this.options.areas = [...new Set(this.options.areas.concat(note.areas))];
      }
      if ('kinds' in note) {
        this.options.kinds = [...new Set(this.options.kinds.concat(note.kinds))];
      }
      if ('sigs' in note) {
        this.options.sigs = [...new Set(this.options.sigs.concat(note.sigs))];
      }
      if (this.options.releaseVersions.indexOf(note.release_version) < 0) {
        this.options.releaseVersions.push(note.release_version);
      }
    }
  }

  toggleFilter(event): void {
    if (typeof this.filter[event.key][event.value] === 'boolean') {
      delete this.filter[event.key][event.value];
    } else {
      this.filter[event.key][event.value] = true;
    }
  }
}
