import { TestBed } from '@angular/core/testing';

import { MessageFeed } from './message-feed';
import { REALTIME_SOCKET, RealtimeSocket } from './realtime-socket';

/**
 * Faux socket : enregistre les abonnements et laisse le test simuler un
 * événement serveur via `serverEmit`. Aucune vraie connexion réseau.
 */
class FakeSocket implements RealtimeSocket {
  private readonly listeners = new Map<string, ((...args: unknown[]) => void)[]>();
  connectCalls = 0;
  disconnectCalls = 0;

  connect(): void {
    this.connectCalls++;
  }
  disconnect(): void {
    this.disconnectCalls++;
  }
  on(event: string, listener: (...args: unknown[]) => void): void {
    const list = this.listeners.get(event) ?? [];
    list.push(listener);
    this.listeners.set(event, list);
  }
  off(event: string, listener?: (...args: unknown[]) => void): void {
    if (!listener) {
      this.listeners.delete(event);
      return;
    }
    const list = this.listeners.get(event) ?? [];
    this.listeners.set(
      event,
      list.filter((l) => l !== listener),
    );
  }

  /** Aide de test : déclenche un événement comme si le serveur l'avait émis. */
  serverEmit(event: string, ...args: unknown[]): void {
    (this.listeners.get(event) ?? []).forEach((l) => l(...args));
  }
}

describe('MessageFeed', () => {
  let socket: FakeSocket;
  let feed: MessageFeed;

  beforeEach(() => {
    socket = new FakeSocket();
    TestBed.configureTestingModule({
      providers: [{ provide: REALTIME_SOCKET, useValue: socket }],
    });
    feed = TestBed.inject(MessageFeed);
  });

  it('expose null tant qu’aucun message n’est reçu', () => {
    expect(feed.message()).toBeNull();
  });

  it('expose le dernier message reçu du serveur', () => {
    socket.serverEmit('message', { content: 'coucou' });

    expect(feed.message()).toEqual({ content: 'coucou' });
  });
  it('se connecte au démarrage', () => {
    expect(socket.connectCalls).toBe(1);
  });
  it('connected() reflète les évènements connect/disconnect', () => {
    expect(feed.connected()).toBe(false);

    socket.serverEmit('connect');
    expect(feed.connected()).toBe(true);

    socket.serverEmit('disconnect');
    expect(feed.connected()).toBe(false);
  });
});
