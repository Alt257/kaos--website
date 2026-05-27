import { Routes } from '@angular/router';
import { MatchImproMessages } from './features/match-impro/match-impro-messages/match-impro-messages';

export const routes: Routes = [
  {
    path: 'match-impro',
    component: MatchImproMessages,
  },
  {
    path: '',
    redirectTo: 'match-impro',
    pathMatch: 'full',
  },
];
