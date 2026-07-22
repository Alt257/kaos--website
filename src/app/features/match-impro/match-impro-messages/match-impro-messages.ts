import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatchImproService } from '../match-impro.service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-match-impro-messages',
  imports: [DatePipe, AsyncPipe],
  templateUrl: './match-impro-messages.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './match-impro-messages.css',
})
export class MatchImproMessages implements OnInit, OnDestroy {
  private readonly matchImproService = inject(MatchImproService);

  readonly message$ = this.matchImproService.lastMessage$;

  async ngOnInit(): Promise<void> {
    await this.matchImproService.connect();
  }

  async ngOnDestroy(): Promise<void> {
    await this.matchImproService.disconnect();
  }
}
