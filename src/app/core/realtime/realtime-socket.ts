import { InjectionToken } from '@angular/core';

/**
 * Port : le sous-ensemble de l'API socket.io dont l'application a besoin.
 * Le service dépend de cette interface, pas de `socket.io-client` — ce qui
 * permet d'injecter un faux socket en test (inversion de dépendance).
 */
export interface RealtimeSocket {
  on(event: string, listener: (...args: unknown[]) => void): void;
  off(event: string, listener?: (...args: unknown[]) => void): void;
  connect(): void;
  disconnect(): void;
}

/** Jeton d'injection : résolu vers le vrai socket en prod, vers un faux en test. */
export const REALTIME_SOCKET = new InjectionToken<RealtimeSocket>('REALTIME_SOCKET');
