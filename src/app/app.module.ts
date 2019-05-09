import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { NotesComponent } from './notes/notes.component';
import { OptionsComponent } from './options/options.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoggerService } from '@shared/services/logger.service';

import { EffectsModule } from '@ngrx/effects';
import { NotesEffects } from './notes/notes.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { environment } from '../environments/environment';
import { notesReducer } from './notes/notes.reducer';
import { reducers } from './app.reducer';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';

@NgModule({
  declarations: [AppComponent, NotesComponent, OptionsComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
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
    StoreModule.forRoot({ notes: notesReducer }),
    EffectsModule.forRoot([NotesEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [LoggerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
