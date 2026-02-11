import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { first, skip, takeUntil } from 'rxjs/operators';
import { State } from '@app/app.reducer';
import { OptionType } from '@app/shared/model/options.model';
import { Filter } from '@app/shared/model/filter.model';
import { UpdateFilter } from '@app/filter/filter.actions';
import { ModalComponent } from '@app/modal/modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap/collapse';
import { getFilterSelector } from '@app/filter/filter.reducer';
import { FilterComponent } from '@app/filter/filter.component';
import { NotesComponent } from '@app/notes/notes.component';
import { SettingsComponent } from '@app/settings/settings.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbCollapseModule,
    FilterComponent,
    NotesComponent,
    SettingsComponent,
  ],
})
export class MainComponent implements OnDestroy {
  filter: Filter = new Filter();
  isNavbarCollapsed = true;
  private destroy$ = new Subject<void>();
  private aboutContent = '';

  constructor(
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {
    // Load about modal content
    this.http
      .get('app/main/about-modal-content.html', { responseType: 'text' })
      .pipe(takeUntil(this.destroy$))
      .subscribe(content => {
        this.aboutContent = content;
      });
    this.route.queryParamMap
      .pipe(skip(1), first(), takeUntil(this.destroy$))
      .subscribe(queryParamMap => {
        const f = new Filter();
        for (let i = 0, len = queryParamMap.keys.length; i < len; i++) {
          const key = queryParamMap.keys[i];
          if (key !== f.markdownKey) {
            for (const value of queryParamMap.getAll(key)) {
              const optionKey = key as keyof typeof OptionType;
              if (optionKey in OptionType) {
                f.set(OptionType[optionKey], value);
              }
            }
          } else {
            const textValue = queryParamMap.get(key);
            if (textValue !== null) {
              f.text = textValue;
            }
          }
        }
        this.store.dispatch(new UpdateFilter(f));
      });
    this.store
      .pipe(select(getFilterSelector), skip(1), takeUntil(this.destroy$))
      .subscribe(filter => {
        this.filter = filter;
        this.updateURI();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    // If content is not yet loaded, wait for it
    if (!this.aboutContent) {
      this.http
        .get('app/main/about-modal-content.html', { responseType: 'text' })
        .pipe(first())
        .subscribe(content => {
          this.aboutContent = content;
          this.showModal();
        });
    } else {
      this.showModal();
    }
  }

  private showModal(): void {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'About this project';
    modalRef.componentInstance.content = this.aboutContent;
  }
}
