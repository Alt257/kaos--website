import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class ShowMessagesService {
  private readonly _messages$ = new Observable<Message>(() => {});
}
