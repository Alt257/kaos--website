import { inject, Injectable } from '@angular/core';
import { MatchImproMessage } from './match-impro-message.model';
import { Observable, scan, shareReplay } from 'rxjs';
import { MatchImproHubClient } from '../../core/signalr/match-impro-hub.client';

@Injectable({
  providedIn: 'root',
})
export class MatchImproService {
  private readonly matchImproHubClient = inject(MatchImproHubClient);

  readonly messageReceived$: Observable<MatchImproMessage> = this.matchImproHubClient.messages$;

  readonly messages$: Observable<readonly MatchImproMessage[]> = this.messageReceived$.pipe(
    scan((messages, message) => [...messages, message], [] as MatchImproMessage[]),
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  connect(): Promise<void> {
    return this.matchImproHubClient.start();
  }

  disconnect(): Promise<void> {
    return this.matchImproHubClient.stop();
  }
}
