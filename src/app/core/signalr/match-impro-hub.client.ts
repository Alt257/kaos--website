import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { MatchImproMessage } from '../../features/match-impro/match-impro-message.model';
import { SignalRConnectionFactory } from './signalr-connection.factory';

interface ReceiveMessagePayload {
  type: 'itemUpdated';
  timestamp: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class MatchImproHubClient {
  private readonly hubUrl = 'http://127.0.0.1:8080/hubs/match-impro';
  private readonly connection: signalR.HubConnection;
  private readonly messagesSubject = new Subject<MatchImproMessage>();

  private isStarted = false;

  readonly messages$: Observable<MatchImproMessage> = this.messagesSubject.asObservable();

  constructor(connectionFactory: SignalRConnectionFactory) {
    this.connection = connectionFactory.create(this.hubUrl);
    this.registerHandlers();
  }

  async start(): Promise<void> {
    if (this.isStarted) {
      return;
    }

    await this.connection.start();
    this.isStarted = true;
  }

  async stop(): Promise<void> {
    await this.connection.stop();
  }

  private registerHandlers(): void {
    this.connection.on('ReceiveMessage', (message: ReceiveMessagePayload) => {
      if (message.type !== 'itemUpdated') {
        return;
      }

      this.messagesSubject.next({
        broadcastedAt: new Date(message.timestamp).getTime(),
        receivedAt: new Date(),
        content: message.content,
      });
    });
  }
}
