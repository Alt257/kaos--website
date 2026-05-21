import { TestBed } from '@angular/core/testing';
import * as signalR from '@microsoft/signalr';
import { MatchImproHubClient } from './match-impro-hub.client';
import { SignalRConnectionFactory } from './signalr-connection.factory';

describe('MatchImproHubClient', () => {
  let client: MatchImproHubClient;

  const handlers = new Map<string, (...args: unknown[]) => void>();

  const hubConnectionMock = {
    start: vi.fn().mockResolvedValue(Promise.resolve()),
    stop: vi.fn().mockResolvedValue(Promise.resolve()),
    on: vi.fn((eventName, callback) => {
      handlers.set(eventName, callback);
    }),
    off: vi.fn((eventName, callback) => {
      handlers.delete(eventName);
    }),
    send: vi.fn().mockResolvedValue(Promise.resolve()),
  } as unknown as signalR.HubConnection;

  const factoryMock = {
    create: vi.fn(() => hubConnectionMock),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: SignalRConnectionFactory, useValue: factoryMock }],
    });

    client = TestBed.inject(MatchImproHubClient);
  });

  //>>> TESTS

  it('should create the SignalR connection with the expected hub URL', () => {
    expect(factoryMock.create).toHaveBeenCalledWith(
      'http://127.0.0.1:8080/hubs/match-impro',
      );
  });

  it('should start the connection', async () => {
    await client.start();

    expect(hubConnectionMock.start()).toHaveBeenCalled();
  });

  it('should emit a message when ReceiveMessage is received', done => {
    client.messages$.suscribe(message => {
      expect(message).toEqual({
        content: 'Hello SignalR',
        receivedAt: expect.any(Date),
      });
      done();
    });

    const receiveMessageHandler = handlers.get('ReceiveMessage');

    expect(receiveMessageHandler).toBeDefined();

    receiveMessageHandler?.('Hello SignalR');
  });

  it('should stop the connection', async () => {
    await client.stop();

    expect(hubConnectionMock.stop()).toHaveBeenCalled();
  });

  //<<< TESTS
})
