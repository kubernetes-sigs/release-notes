import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from '@app/main/main.component';

/**
 * The main app component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, MainComponent],
})
export class AppComponent {
  title = 'Kubernetes Release Notes';
}
