import { ChangeDetectionStrategy, Component, inject, Injector, input, OnInit } from '@angular/core';
import { TodoDTO, TodoStatus } from '../../../services/todo-socket.api.service';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { DashboardState } from '../dashboard.state';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { CreateTodoDialogComponent } from '../create-todo-dialog/create-todo-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCard } from '@angular/material/card';


@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [
    CommonModule,
    MatIconButton,
    MatCheckbox,
    ReactiveFormsModule,
    MatCard,
  ],
})
export class CardComponent implements OnInit {
  item = input.required<TodoDTO>();
  private readonly state = inject(DashboardState);
  private readonly dialog = inject(MatDialog);
  private injector = inject(Injector);

  readonly checkbox= new FormControl<boolean>(false);

  private readonly onStatusChange = this.checkbox.valueChanges
    .pipe(
      tap(checked => {
        const item = { ...this.item() };
        item.status = checked
          ? TodoStatus.DONE
          : TodoStatus.TODO;

        this.state.update(item);
      }),
      takeUntilDestroyed(),
    )
    .subscribe();
  delete() {
    this.state.delete(this.item().id);
  }
  edit() {
    this.dialog.open(CreateTodoDialogComponent, {
      data: this.item(),
      injector: this.injector
    });
  }
  ngOnInit() {
    this.checkbox.setValue(this.item().status === TodoStatus.DONE, { emitEvent: false });
  }
}
