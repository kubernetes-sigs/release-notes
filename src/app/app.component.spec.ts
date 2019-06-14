import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let instance: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    instance = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(instance).toBeTruthy();
  });

  it(`should have as title 'Kubernetes Release Notes'`, () => {
    expect(instance.title).toEqual('Kubernetes Release Notes');
  });
});
