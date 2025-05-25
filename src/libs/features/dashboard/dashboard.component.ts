import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardState } from './dashboard.state';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DashboardState],
  imports: [],
})
export class DashboardComponent {
  readonly state = inject(DashboardState);
}
