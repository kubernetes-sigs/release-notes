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
