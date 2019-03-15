import { Component, OnInit, ViewChild,  } from '@angular/core';
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
    release_versions: [],
    sigs: [],
  } as Options;
  filter = {
    areas: [],
    kinds: [],
    release_versions: [],
    sigs: [],
    markdown: '',
  };
  @ViewChild(NotesComponent) noteChild;

  constructor() { }

  ngOnInit() {
    //this.getOptions();
  }

  updateFilterString(a, b): void {
    if (b.length > 0) {
      this.filter[a] = b;
    } else {
      this.filter[a] = '';
    }
  }

  updateFilterObject(a, b, val): void {
    if(val){
      this.filter[a][b] = val;
    } else {
      delete this.filter[a][b];
    }
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
      if (this.options.release_versions.indexOf(note.release_version) < 0) {
        this.options.release_versions.push(note.release_version);
      }
    }
  }

  toggleFilter(event): void {
    if (typeof this.filter[event.key][event.value] === 'boolean') {
      delete this.filter[event.key][event.value];
    } else {
      this.filter[event.key][event.value] = true;
    }

    //this.noteChild.getNotes(this.filter);
  }

}
