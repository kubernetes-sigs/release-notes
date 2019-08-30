import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { first, skip } from 'rxjs/operators';
import { State } from '@app/app.reducer';
import { Filter } from '@app/shared/model/options.model';
import { UpdateFilter } from '@app/filter/filter.actions';
import { ModalComponent } from '@app/modal/modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getFilterSelector } from '@app/filter/filter.reducer';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent {
  filter: Filter = new Filter();

  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    this.route.queryParamMap
      .pipe(skip(1))
      .pipe(first())
      .subscribe(queryParamMap => {
        const f = new Filter();
        for (let i = 0, len = queryParamMap.keys.length; i < len; i++) {
          const key = queryParamMap.keys[i];
          if (key !== f.markdownKey) {
            for (const value of queryParamMap.getAll(key)) {
              f.set(OptionType[key], value);
            }
          } else {
            f.text = queryParamMap.get(key);
          }
        }
        this.store.dispatch(new UpdateFilter(f));
      });
    this.store
      .pipe(select(getFilterSelector))
      .pipe(skip(1))
      .subscribe(filter => {
        this.filter = filter;
        this.updateURI();
      });
  }

  updateFilterString(to: string): void {
    this.filter.text = to;
    this.store.dispatch(new UpdateFilter(this.filter));
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
}
