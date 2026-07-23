import { inject, Injectable, signal } from '@angular/core';

import { Message } from './message';
import { REALTIME_SOCKET } from './realtime-socket';

@Injectable({ providedIn: 'root' })
export class MessageFeed {
  private readonly socket = inject(REALTIME_SOCKET);

  // Incomplet volontairement : on ne s'abonne à rien → le 2e test doit échouer.
  readonly message = signal<Message | null>(null).asReadonly();
}
