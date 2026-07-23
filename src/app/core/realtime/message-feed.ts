import { inject, Injectable, signal } from '@angular/core';

import { Message } from './message';
import { REALTIME_SOCKET } from './realtime-socket';

/**
 * Flux temps réel des messages de l'écran spectateurs.
 * S'abonne au socket, traduit le payload réseau en modèle de domaine, et
 * expose le dernier message reçu en signal (lecture seule pour l'extérieur).
 */
@Injectable({ providedIn: 'root' })
export class MessageFeed {
  private readonly socket = inject(REALTIME_SOCKET);
  private readonly _message = signal<Message | null>(null);

  /** Dernier message reçu, ou null tant que rien n'est arrivé. */
  readonly message = this._message.asReadonly();

  constructor() {
    this.socket.on('message', (payload) => this._message.set(this.toMessage(payload)));
  }

  /** Traduit le payload brut du serveur en modèle de domaine. */
  private toMessage(payload: unknown): Message {
    const content = (payload as { content?: unknown }).content;
    return { content: typeof content === 'string' ? content : '' };
  }
}
