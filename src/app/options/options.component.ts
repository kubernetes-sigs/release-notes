import { Component, OnInit, ViewChild,  } from '@angular/core';
import { OptionsService } from './options.service';
import { Note } from '../notes/note';
import { Options } from './options';
import { NotesComponent } from '../notes/notes.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent implements OnInit {
  options = {
    areas: [],
    kinds: [],
    releaseVersions: [],
    sigs: [],
  } as Options;
  filter = {
    areas: [],
    kinds: [],
    releaseVersions: [],
    sigs: [],
    markdown: '',
  };
  @ViewChild(NotesComponent) noteChild;

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
    //this.getOptions();
  }

  getOptions(): void {
    this.optionsService.getOptions()
      .subscribe(
        options => {
          for (const option of Object.values(options)) {
            this.filter[Object.keys(option)[0]] = Object.values(option)[0];
          }
          this.options = options;
        }
      );
  }

  updateFilterString(a, b): void {
    if (b.length > 0) {
      this.filter[a] = b;
    } else {
      delete this.filter[a];
    }

    this.noteChild.getNotes(this.filter);
  }

  updateFilterObject(a, b, val): void {
    this.filter[a][b] = val;
    this.noteChild.getNotes(this.filter);
  }

  gotNotes(notes: Note[]): void {
    for (const note of Object.values(notes)) {
      if ('areas' in note) {
        this.options.areas = [... new Set(this.options.areas.concat(note.areas))];
      }
      if ('kinds' in note) {
        this.options.kinds = [... new Set(this.options.kinds.concat(note.kinds))];
      }
      if ('sigs' in note) {
        this.options.sigs = [... new Set(this.options.sigs.concat(note.sigs))];
      }
      if (this.options.releaseVersions.indexOf(note.release_version) < 0) {
        this.options.releaseVersions.push(note.release_version);
      }
    }

    console.log(this.options);
  }

  toggleFilter(event): void {
    console.log(event);
    console.log(this.filter);
    if (typeof this.filter[event.key][event.value] === 'boolean') {
      this.filter[event.key][event.value] = !this.filter[event.key][event.value];
    } else {
      this.filter[event.key][event.value] = true;
    }
    this.noteChild.getNotes(this.filter);
  }

}
