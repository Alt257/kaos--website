import { TestBed } from '@angular/core/testing';
import * as signalR from '@microsoft/signalr';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchImproHubClient } from './match-impro-hub.client';
import { SignalRConnectionFactory } from './signalr-connection.factory';

describe('MatchImproHubClient', () => {
  let client: MatchImproHubClient;

  const handlers = new Map<string, (...args: unknown[]) => void>();

  const hubConnectionMock = {
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    on: vi.fn((eventName: string, callback: (...args: unknown[]) => void) => {
      handlers.set(eventName, callback);
    }),
    off: vi.fn((eventName: string) => {
      handlers.delete(eventName);
    }),
    send: vi.fn().mockResolvedValue(undefined),
  } as unknown as signalR.HubConnection;

  const factoryMock = {
    create: vi.fn(() => hubConnectionMock),
  };

  beforeEach(() => {
    handlers.clear();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        MatchImproHubClient,
        {
          provide: SignalRConnectionFactory,
          useValue: factoryMock,
        },
      ],
    });

    client = TestBed.inject(MatchImproHubClient);
  });

  it('should create the SignalR connection with the expected hub URL', () => {
    expect(factoryMock.create).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/hubs/match-impro',
    );
  });

  it('should register ReceiveMessage handler', () => {
    expect(hubConnectionMock.on).toHaveBeenCalledWith('ReceiveMessage', expect.any(Function));
    expect(handlers.has('ReceiveMessage')).toBe(true);
  });

  it('should start the connection', async () => {
    await client.start();

    expect(hubConnectionMock.start).toHaveBeenCalledOnce();
  });

  it('should stop the connection', async () => {
    await client.stop();

    expect(hubConnectionMock.stop).toHaveBeenCalledOnce();
  });

  it('should emit a message when ReceiveMessage itemUpdated payload is received', async () => {
    const messagePromise = firstValueFrom(client.messages$);
    const receiveMessageHandler = handlers.get('ReceiveMessage');

    expect(receiveMessageHandler).toBeDefined();

    receiveMessageHandler?.({
      type: 'itemUpdated',
      timestamp: '2026-05-21T12:00:00.000Z',
      content: 'Hello SignalR',
    });

    await expect(messagePromise).resolves.toEqual({
      broadcastedAt: new Date('2026-05-21T12:00:00.000Z').getTime(),
      receivedAt: expect.any(Date),
      content: 'Hello SignalR',
    });
  });

  it('should map backend timestamp to broadcastedAt as number', async () => {
    const messagePromise = firstValueFrom(client.messages$);
    const receiveMessageHandler = handlers.get('ReceiveMessage');

    expect(receiveMessageHandler).toBeDefined();

    receiveMessageHandler?.({
      type: 'itemUpdated',
      timestamp: '2026-05-21T14:30:45.123Z',
      content: 'Timestamp test',
    });

    const message = await messagePromise;

    expect(message.broadcastedAt).toBe(new Date('2026-05-21T14:30:45.123Z').getTime());
    expect(typeof message.broadcastedAt).toBe('number');
  });

  it('should set receivedAt with the client reception date', async () => {
    const beforeReception = Date.now();
    const messagePromise = firstValueFrom(client.messages$);
    const receiveMessageHandler = handlers.get('ReceiveMessage');

    expect(receiveMessageHandler).toBeDefined();

    receiveMessageHandler?.({
      type: 'itemUpdated',
      timestamp: '2026-05-21T12:00:00.000Z',
      content: 'Date test',
    });

    const message = await messagePromise;
    const afterReception = Date.now();

    expect(message.receivedAt).toBeInstanceOf(Date);
    expect(message.receivedAt.getTime()).toBeGreaterThanOrEqual(beforeReception);
    expect(message.receivedAt.getTime()).toBeLessThanOrEqual(afterReception);
  });

  it('should ignore unsupported message types', () => {
    const messageSpy = vi.fn();
    const receiveMessageHandler = handlers.get('ReceiveMessage');

    client.messages$.subscribe(messageSpy);

    expect(receiveMessageHandler).toBeDefined();

    receiveMessageHandler?.({
      type: 'unknown',
      timestamp: '2026-05-21T12:00:00.000Z',
      content: 'Should be ignored',
    });

    expect(messageSpy).not.toHaveBeenCalled();
  });
});
