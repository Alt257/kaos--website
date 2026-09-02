import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchImproMessages } from './match-impro-messages';
import { MatchImproService } from '../match-impro.service';

describe('MatchImproMessages', () => {
  let component: MatchImproMessages;
  let fixture: ComponentFixture<MatchImproMessages>;

  const matchImproServiceMock = {
    messages$: of([
      {
        content: 'Hello real-time',
        broadcastedAt: new Date('2026-05-21T12:00:00.000Z').getTime(),
        receivedAt: new Date('2026-05-21T12:00:01.000Z'),
      },
    ]),
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    matchImproServiceMock.connect.mockClear();
    matchImproServiceMock.disconnect.mockClear();

    await TestBed.configureTestingModule({
      imports: [MatchImproMessages],
      providers: [
        {
          provide: MatchImproService,
          useValue: matchImproServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchImproMessages);
  });

  it('should connect to real-time messages on init', () => {
    fixture.detectChanges();

    expect(matchImproServiceMock.connect).toHaveBeenCalledOnce();
  });

  it('should disconnect from real-time messages on destroy', () => {
    fixture.detectChanges();

    fixture.destroy();

    expect(matchImproServiceMock.disconnect).toHaveBeenCalledOnce();
  });

  it('should display received messages', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Hello real-time');
  });
});
