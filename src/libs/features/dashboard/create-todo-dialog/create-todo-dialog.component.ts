import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  TodoComplexity,
  TodoStatus,
} from '../../../services/todo-socket.api.service';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { DashboardState } from '../dashboard.state';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-todo',
  templateUrl: './create-todo-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatSelect,
    MatButton,
    MatOption,
    MatError,
    MatLabel
  ],
  styleUrls: ['./create-todo-dialog.component.scss'],
})
export class CreateTodoDialogComponent implements OnInit {
  private readonly state = inject(DashboardState);

  readonly complexityValues = <TodoComplexity[]>Object.values(TodoComplexity)
  readonly statusValues = <TodoStatus[]>Object.values(TodoStatus);

  readonly form= inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    text: '',
    complexity: [<TodoComplexity>TodoComplexity.MEDIUM, Validators.required],
    status: [<TodoStatus>TodoStatus.TODO, Validators.required],
  })

  private readonly dialogRef = inject(MatDialogRef<CreateTodoDialogComponent>);
  private readonly item = inject(MAT_DIALOG_DATA);
  readonly title = this.item ? 'Edit task' : 'Create task';

  ngOnInit() {
    this.item && this.form.patchValue(this.item, { emitEvent: false });
  }

  save() {
    if (this.form.valid) {
      const value = { ...this.form.getRawValue() };
      if (this.item) {
        this.state.update({
          id: this.item.id,
          ...value,
        });
      } else {
        this.state.add(value);
      }
      this.dialogRef.close();
    }
  }
}
