import { describe } from 'vitest';
import { firstValueFrom, Subject } from 'rxjs';
import { MatchImproMessage } from './match-impro-message.model';
import { TestBed } from '@angular/core/testing';
import { MatchImproHubClient } from '../../core/signalr/match-impro-hub.client';
import { MatchImproService } from './match-impro.service';

describe('MatchImproService', () => {
  let service: MatchImproService;
  let messagesSubject: Subject<MatchImproMessage>;

  const hubClientMock = {
    messages$: undefined as unknown,
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    messagesSubject = new Subject<MatchImproMessage>();

    hubClientMock.messages$ = messagesSubject.asObservable();
    hubClientMock.start.mockClear();
    hubClientMock.stop.mockClear();

    TestBed.configureTestingModule({
      providers: [
        MatchImproService,
        { provide: MatchImproHubClient, useValue: hubClientMock },
      ],
    });

    service = TestBed.inject(MatchImproService);
  });

  ///////////////// TESTS \\\\\\\\\\\\\\\\\\\

  it('should connect to the SignalR hub', async () => {
    await service.connect();

    expect(hubClientMock.start).toHaveBeenCalledOnce();
  });


  it('should disconnect to the SignalR hub', async () => {
    await service.disconnect();

    expect(hubClientMock.stop).toHaveBeenCalledOnce();
  });

  it('should expose received messages', async () => {
    const expectedMessage: MatchImproMessage = {
      content: 'Message from backend',
      broadcastedAt: new Date('2026-05-21T12:00:00.000Z').getTime(),
      receivedAt: new Date(),
    };

    const messagePromise = firstValueFrom(service.messageReceived$);

    messagesSubject.next(expectedMessage);

    await expect(messagePromise).resolves.toBe(expectedMessage);
  });

});
