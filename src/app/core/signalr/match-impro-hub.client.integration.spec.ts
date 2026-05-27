import { firstValueFrom, timeout } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { SignalRConnectionFactory } from './signalr-connection.factory';
import { MatchImproHubClient } from './match-impro-hub.client';

async function sendMessage(url: string, route: string, message: string) {
  return await fetch(url + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
    }),
  });
}

describe('MatchImproHubClient integration', () => {
  const devUrl = 'http://127.0.0.1:8080';
  const routeMessages = '/match-impro';

  it('should connect to the backend SignalR hub', async () => {
    const client = new MatchImproHubClient(new SignalRConnectionFactory());

    await expect(client.start()).resolves.toBeUndefined();

    await client.stop();
  });

  it('should send a message to the dev backend', async () => {
    const response = await sendMessage(devUrl, routeMessages, 'Hello dev backend ?');

    expect(response.status).toBe(200);
  });

  it('should receive message updates from the dev backend', async () => {
    const client = new MatchImproHubClient(new SignalRConnectionFactory());

    await client.start();

    const messagePromise = firstValueFrom(client.messages$.pipe(timeout({ first: 5000 })));

    await sendMessage(devUrl, routeMessages, 'Hello dev backend ?');

    const message = await messagePromise;

    expect(message.content).toBeTruthy();
    expect(typeof message.broadcastedAt).toBe('number');
    expect(message.receivedAt).toBeInstanceOf(Date);

    await client.stop();
  }, 10000);
});
