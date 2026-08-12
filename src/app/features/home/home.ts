import { Component, computed, signal } from '@angular/core';
import { Show } from '../../core/shows/show';
import { ShowCard } from './components/show-card/show-card';

@Component({
  selector: 'app-home',
  imports: [ShowCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly upcomingShows = signal<readonly Show[]>([
    {
      id: 'brassee-2026-09-01',
      day: '1',
      month: 'sept.',
      title: 'Mardi 1er septembre — 19h30',
      url: 'https://www.labrassee.cafe/scene',
      venue: { name: 'la Brassée', url: 'https://www.labrassee.cafe/' },
    },
  ]);

  protected readonly nextShow = computed(() => this.upcomingShows().at(0));
}
