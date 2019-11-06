import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { MainComponent } from './main/main.component';
import { ModalComponent } from './modal/modal.component';
import { NotesComponent } from './notes/notes.component';
import { SettingsComponent } from './settings/settings.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoggerService } from '@shared/services/logger.service';

import { EffectsModule } from '@ngrx/effects';
import { NotesEffects } from './notes/notes.effects';
import { FilterEffects } from './filter/filter.effects';
import { SettingsEffects } from './settings/settings.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { environment } from '@env/environment';
import { notesReducer } from './notes/notes.reducer';
import { settingsReducer } from './settings/settings.reducer';
import { filterReducer } from './filter/filter.reducer';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    MainComponent,
    ModalComponent,
    NotesComponent,
    SettingsComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
        },
      },
    }),
    StoreModule.forRoot({
      filter: filterReducer,
      notes: notesReducer,
      settings: settingsReducer,
    }),
    EffectsModule.forRoot([FilterEffects, NotesEffects, SettingsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    FontAwesomeModule,
  ],
  providers: [LoggerService],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent],
})
export class AppModule {}
