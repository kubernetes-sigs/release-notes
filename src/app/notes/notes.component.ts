import { Component, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from './note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  providers: [ NotesService ],
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes: Note[];
  filteredNotes: Note[];
  p = 1;
  @Input() filter: {};
  @Output() filterUpdate = new EventEmitter<object>();
  @Output() gotNotes = new EventEmitter<Note[]>();

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    this.getNotes({});
  }

  emptyFilter(): boolean {
    for ( const key in this.filter ) {
      if (Object.keys(this.filter[key]).length > 0) {
        return false;
      }
    }
    return true;
  }

  doFilter(notes): Note[] {
    if (this.emptyFilter()) {
      return this.notes;
    } else {
      const filteredNotes: Note[] = [];
      for (const note of notes) {
        for (const key in this.filter) {
          if (key === 'release_versions' && Object.keys(this.filter[key]).indexOf(note.release_version) >= 0) {
            filteredNotes.push(note);
          } else {
            if (key in note && typeof note[key] !== 'string' ) {
              if ([...new Set(note[key])].filter(x => {
                return (this.filter[key].indexOf(x) && this.filter[key][x]);
              }).length > 0) {
                filteredNotes.push(note);
              }
            } else {
              if (key in note && typeof note[key] === 'string' && this.filter[key].trim().length > 0) {
                if (note[key].toUpperCase().trim().includes(this.filter[key].toUpperCase().trim())) {
                  filteredNotes.push(note);
                }
              }
            }
          }
        }
      }
      return filteredNotes;
    }
  }

  getNotes(filter): void {
    this.notesService.getNotes(filter)
      .subscribe(notes => {
        this.notes = notes;
        this.filteredNotes = notes;
        this.gotNotes.emit(notes);
      });
  }

  toggleFilter(key, value): void {
    this.filterUpdate.emit({key, value});
  }

}
