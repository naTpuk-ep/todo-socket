import { ChangeDetectionStrategy, Component, computed, inject, Injector } from '@angular/core';
import { DashboardState } from './dashboard.state';
import { CreateTodoDialogComponent } from './create-todo-dialog/create-todo-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TodoStatus } from '../../services/todo-socket.api.service';
import { CardComponent } from './card/card.component';
import { MatDivider } from '@angular/material/divider';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [DashboardState],
  imports: [
    MatButton,
    MatDivider,
    CardComponent,
  ],
})
export class DashboardComponent {

  readonly state = inject(DashboardState);
  private readonly dialog = inject(MatDialog);
  private readonly injector = inject(Injector);

  readonly todoItems = computed(() =>
    this.state.list()?.filter(item => item.status === TodoStatus.TODO).sort((a, b) => a.id - b.id)
  );
  readonly doneItems = computed(() =>
    this.state.list()?.filter(item => item.status === TodoStatus.DONE).sort((a, b) => a.id - b.id)
  );



  onOpenCreateDialog() {
    this.dialog.open(CreateTodoDialogComponent, {
      injector: this.injector,
    });
  }
}
