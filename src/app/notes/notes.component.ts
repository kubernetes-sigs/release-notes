import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    this.getNotes({});
  }

  getNotes(filter): void {
    this.notesService.getNotes(filter)
      .subscribe(notes => this.notes = notes);
  }

  updateFilter(filter): void {
    this.getNotes(filter);
  }

}
