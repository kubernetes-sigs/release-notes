import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Note } from '@app/notes/notes.model';
import { Filter, Options } from '@app/shared/model/options.model';
import { NotesComponent } from '@app/notes/notes.component';
import { ModalComponent } from '@app/modal/modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
})
export class OptionsComponent implements OnInit {
  options: Options = new Options();
  filter: Filter = new Filter();
  @ViewChild(NotesComponent, { static: true }) noteChild;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParamMap => {
      if ('filter' in this && this.filter.isEmpty()) {
        for (const i of Object.keys(this.filter)) {
          if (queryParamMap.getAll(i).length > 0) {
            if (i !== 'markdown') {
              for (const x of queryParamMap.getAll(i)) {
                this.filter[i][x] = true;
              }
            } else {
              this.filter.setMarkdown(queryParamMap.get(i));
            }
          }
        }
        this.noteChild.update(this.filter);
      }
    });
  }

  updateFilterString(a, b): void {
    if (b.length > 0) {
      this.filter[a] = b;
    } else {
      this.filter[a] = '';
    }
    this.noteChild.update(this.filter);

    this.updateURI();
  }

  updateFilterObject(a, b, val): void {
    if (val) {
      this.filter[a][b] = val;
    } else {
      delete this.filter[a][b];
    }
    this.noteChild.update(this.filter);

    this.updateURI();
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

    this.updateURI();
  }

  updateURI(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.filter.toURI(),
    });
  }

  openModal(): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'About this project';
    modalRef.componentInstance.content = `
        <strong>Hi</strong> there!
    `;
  }
}
