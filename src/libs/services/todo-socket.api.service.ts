import { inject, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { filter, tap } from 'rxjs';
import { UserApiService, UserDTO } from './user.api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import observableSocket from '../utils/observable-socket';


export enum TodoStatus {
  TODO = 'TODO',
  DONE = 'DONE',
}
export enum TodoComplexity {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}
export interface TodoAdd {
  title: string;
  text: string;
  status: TodoStatus;
  complexity: TodoComplexity;
}
export interface TodoUpdate extends TodoAdd {
  id: number;
}
export interface TodoDTO extends TodoUpdate {
  id: number;
  createdBy: UserDTO;
  updatedBy: UserDTO;
  createdAt: Date;
  updatetAt: Date;
}

export interface SocketError {
  message: string;
  name: string;
  response: {
    statusCode: number;
    message: string;
  };
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class TodoSocketApiService {
  private readonly todosSocketApi = '/todos';
  private readonly socket = io(this.todosSocketApi, {
    auth: {
      Authorization: UserApiService.tokenGetter()
    }
  });
  private readonly snack = inject(MatSnackBar);
  private readonly user = inject(UserApiService);

  readonly onError = observableSocket<SocketError>(this.socket, 'error');

  private readonly  messageOnError = this.onError
    .pipe(
      tap(e => {
        this.snack.open(`${e?.message}`, 'Close');
      })
    )
    .subscribe();

  private readonly logoutOnUnauthorized = this.onError
    .pipe(
      filter(e => e.status === 401),
      tap(() => { this.user.logOut() })
    )
    .subscribe()

  readonly onList = observableSocket<TodoDTO[]>(this.socket, 'todos');
  readonly onAdd = observableSocket<TodoDTO>(this.socket, 'addedTodo');
  readonly onUpdate = observableSocket<TodoDTO>(this.socket, 'updatedTodo')
  readonly onDelete = observableSocket<number>(this.socket, 'deletedTodo')

  add(todoItem: TodoAdd) {
    this.socket.emit('addTodo', todoItem);
  }
  update(updatedItem: TodoUpdate) {
    this.socket.emit('updateTodo', updatedItem);
  }
  delete(id: number) {
    this.socket.emit('deleteTodo', id);
  }
  connect() {
    this.socket.connect();
  }
  disconnect() {
    this.socket.disconnect();
  }
}
