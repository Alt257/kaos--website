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
      id: 'brassee-2026-10-06',
      day: '6',
      month: 'oct.',
      title: 'Cabaret KAOS-tik ! — Mardi 6 octobre — 19h30',
      description: "Cabaret d'impro avec une surprise en 2ième partie !",
      url: 'https://www.labrassee.cafe/scene',
      venue: { name: 'la Brassée', url: 'https://www.labrassee.cafe/' },
    },
    {
      id: 'brassee-2026-11-03',
      day: '3',
      month: 'nov.',
      title: 'Cabaret KAOS-tik ! — Mardi 3 novembre — 19h30',
      description: "Cabaret d'impro avec une surprise en 2ième partie !",
      url: 'https://www.labrassee.cafe/scene',
      venue: { name: 'la Brassée', url: 'https://www.labrassee.cafe/' },
    },
  ]);

  protected readonly nextShow = computed(() => this.upcomingShows().at(0));
}
