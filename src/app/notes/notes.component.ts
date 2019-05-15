import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Note } from './notes.model';
import { DoFilter, GetNotes } from './notes.actions';
import { State } from '@app/app.reducer';
import { getAllNotesSelector, getFilteredNotesSelector } from './notes.reducer';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  providers: [],
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent {
  @Input() filter: {};
  @Output() filterUpdate = new EventEmitter<object>();
  @Output() gotNotes = new EventEmitter<Note[]>();
  allNotes: Note[];
  filteredNotes: Note[];
  p = 1;

  constructor(private store: Store<State>) {
    store.dispatch(new GetNotes(this.filter));

    this.store.pipe(select(getAllNotesSelector)).subscribe(n => {
      // Initial retrieval of the notes
      this.allNotes = n;
      this.filteredNotes = n;
      this.gotNotes.emit(n);
    });

    this.store.pipe(select(getFilteredNotesSelector)).subscribe(n => {
      // Filter update of the notes
      this.filteredNotes = n;
    });
  }

  public update(filter: object) {
    this.filter = filter;
    this.store.dispatch(new DoFilter(this.allNotes, filter));
  }

  public toggleFilter(key, value) {
    this.filterUpdate.emit({ key, value });
    this.store.dispatch(new DoFilter(this.allNotes, this.filter));
  }
}
