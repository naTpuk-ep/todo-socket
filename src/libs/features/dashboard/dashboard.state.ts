import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toLazySignal } from 'ngxtension/to-lazy-signal';
import {
  TodoAdd,
  TodoDTO,
  TodoSocketApiService,
  TodoUpdate,
} from '../../services/todo-socket.api.service';


@Injectable()
export class DashboardState implements OnDestroy {
  private readonly apiService = inject(TodoSocketApiService);
  private readonly list$ = new BehaviorSubject<TodoDTO[] | null>(null);

  readonly list = toLazySignal(
    this.apiService.onList
      .pipe(
        tap(list => {
          this.list$.next(list);
        }),
        switchMap(_ => this.list$),
      )
  );

  private readonly onAdd =
    this.apiService.onAdd
      .pipe(
        tap(item => {
          const list = this.list$.value || [];
          this.list$.next([...list, item]);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();

  private readonly onUpdate =
    this.apiService.onUpdate
      .pipe(
        tap(item => {
          const list = this.list$.value;
          list
            && (list[list.findIndex(listItem => item.id === listItem.id)] = item)
            && this.list$.next([...list]);
        }),
        takeUntilDestroyed()
      )
      .subscribe();

  private readonly onDelete =
    this.apiService.onDelete
      .pipe(
        tap(id => {
          const list = this.list$.value;
          list
            && list.splice(list.findIndex(item => item.id === id), 1)
            && this.list$.next([...list]);
        }),
        takeUntilDestroyed()
      )
      .subscribe();


  constructor() {
    this.apiService.connect();
  }

  ngOnDestroy() {
    this.apiService.disconnect();
  }

  add(todo: TodoAdd) {
    this.apiService.add(todo);
  }

  update(todo: TodoUpdate) {
    this.apiService.update(todo);
  }

  delete(id: number) {
    this.apiService.delete(id);
  }

}
