import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
  @Input() filter: {};
  @Output() filterUpdate = new EventEmitter<object>();
  @Output() gotNotes = new EventEmitter<Note[]>();

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    this.getNotes({});
  }

  emptyFilter(): boolean {
    for( let key in this.filter ) {
      if(Object.keys(this.filter[key]).length > 0){
        return false;
      }
    }
    return true
  }

  doFilter(note): boolean {
    if(this.emptyFilter()){
      return true
    } else {
      for(let key in this.filter) {
        if(key == 'release_versions' && Object.keys(this.filter[key]).indexOf(note.release_version) >= 0) {
          return true;
        }
        else if(key in note && typeof note[key] !== 'string' ){
          if([...new Set(note[key])].filter(x => {
            return (this.filter[key].indexOf(x) && this.filter[key][x]);
          }).length > 0) {
            return true;
          }
        } else if (key in note && typeof note[key] === 'string' && this.filter[key].trim().length > 0) {
          if (note[key].toUpperCase().trim().includes(this.filter[key].toUpperCase().trim())){
            return true;
          }
        }
      }
      return false;
    }
  }

  getNotes(filter): void {
    this.notesService.getNotes(filter)
      .subscribe(notes => {
        this.notes = notes;
        this.gotNotes.emit(notes);
      });
  }

  updateFilter(filter): void {
    this.getNotes(filter);
  }

  toggleFilter(key, value): void {
    this.filterUpdate.emit({'key': key, 'value': value});
  }

}
