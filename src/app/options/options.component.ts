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
                this.filter.add(i, x);
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
      this.filter.add(a, b);
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
      this.filter.add(event.key, event.value);
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
        <p>
            Thank you for giving the official Kubernetes Release Notes website
            a try! The project aims to provide you with the best possible user
            experience when it comes to finding out what changed in Kubernetes.
        </p>
        <p>
            We would love feedback on your experience using this website. We
            are particularly interested in:
            <ul>
                <li>
                    how easy it is to use and find what you are looking for
                </li>
                <li>
                    the look and feel
                </li>
                <li>
                    how to improve it further for your specific use case
                </li>
            </ul>
            We would appreciate it if you could take a few minutes to fill out
            our survey and help us to improve!
        </p>
        <p>
            <a href="https://forms.gle/XJJamzwFPPfujtfd9" taget="_blank">
                👉 Help us and participate in the survey.
            </a>
        </p>
            We aim to evaluate the results of the survey at the end of the
            v1.16 release cycle on the official Kubernetes
            <a href="https://groups.google.com/forum/#!forum/kubernetes-sig-release"
               target="_bank">SIG release mailing list</a>.
        </p>
        <p>
            Do you want to contribute or give further feedback? Great, feel
            free to open up a pull request or issue in the
            <a href="https://github.com/kubernetes-sigs/release-notes"
               target="_blank">GitHub repository</a>.
            Beside this, you can always contact us via the official
            <a href="https://kubernetes.slack.com/messages/sig-release"
               target="_blank">Kubernetes Slack #sig-release channel</a>.
        </p>
    `;
  }

  /**
   * Create the options header ID from the given input string
   *
   * @param input   The provided input string
   *
   * @returns The prefixed output string
   */
  optionsHeaderID(input: string): string {
    return `options-${input}`;
  }

  /**
   * Create the options checkbox ID from the given input string. This method
   * also stripps invalid dot (.) characters from the input.
   *
   * @param input   The provided input string
   *
   * @returns The prefixed output string
   */
  optionCheckboxID(input: string): string {
    // Strip the dots from the release versions
    const stripped = input.replace(/\./g, '-');
    return `option-${stripped}`;
  }
}
