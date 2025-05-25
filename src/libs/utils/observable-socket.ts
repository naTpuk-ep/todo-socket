import { Socket } from 'socket.io-client';
import { Observable } from 'rxjs';


export default function observableSocket<T>(socket: Socket, event: string) {
  return new Observable<T>(observer => {
    socket.on(event, (data: T) => {
      observer.next(data);
    })
  });
}
