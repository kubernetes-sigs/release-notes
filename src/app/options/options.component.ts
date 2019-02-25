import { Component, OnInit, ViewChild,  } from '@angular/core';
import { OptionsService } from './options.service';
import { Options } from './options';
import { NotesComponent } from '../notes/notes.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent implements OnInit {
  options: Options;
  filter = {};
  @ViewChild(NotesComponent) noteChild;

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
    this.getOptions();
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

  updateFilter(a, b, val): void {
    this.filter[a][b] = val;
    this.noteChild.getNotes(this.filter);
  }

}
