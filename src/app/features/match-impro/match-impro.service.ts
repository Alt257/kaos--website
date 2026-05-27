import { inject, Injectable } from '@angular/core';
import { MatchImproMessage } from './match-impro-message.model';
import { Observable, shareReplay } from 'rxjs';
import { MatchImproHubClient } from '../../core/signalr/match-impro-hub.client';

@Injectable({
  providedIn: 'root',
})
export class MatchImproService {
  private readonly matchImproHubClient = inject(MatchImproHubClient);

  readonly messageReceived$: Observable<MatchImproMessage> = this.matchImproHubClient.messages$;

  readonly lastMessage$: Observable<MatchImproMessage> = this.messageReceived$.pipe(
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
