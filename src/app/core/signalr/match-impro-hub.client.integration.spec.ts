import { firstValueFrom, timeout } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { SignalRConnectionFactory } from './signalr-connection.factory';
import { MatchImproHubClient } from './match-impro-hub.client';

describe('MatchImproHubClient integration', () => {
  it('should connect to the backend SignalR hub', async () => {
    const client = new MatchImproHubClient(new SignalRConnectionFactory());

    await expect(client.start()).resolves.toBeUndefined();

    await client.stop();
  });

  it('should receive message updates from the backend', async () => {
    const client = new MatchImproHubClient(new SignalRConnectionFactory());

    await client.start();

    const messagePromise = firstValueFrom(
      client.messages$.pipe(timeout({ first: 5000 })),
    );

    const message = await messagePromise;

    expect(message.content).toBeTruthy();
    expect(typeof message.broadcastedAt).toBe('number');
    expect(message.receivedAt).toBeInstanceOf(Date);

    await client.stop();
  }, 10000);
});
