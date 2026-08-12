import { Component, input } from '@angular/core';
import { Show } from '../../../../core/shows/show';

export type ShowCardVariant = 'default' | 'compact';

@Component({
  selector: 'app-show-card',
  templateUrl: './show-card.html',
  styleUrl: './show-card.css',
})
export class ShowCard {
  readonly show = input.required<Show>();
  readonly variant = input<ShowCardVariant>('default');
}
