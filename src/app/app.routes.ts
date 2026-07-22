import { Routes } from '@angular/router';
import { MatchImproMessages } from './features/match-impro/match-impro-messages/match-impro-messages';
import { BroadcastMessages } from './features/show-screen/components/broadcast-messages/broadcast-messages';

export const routes: Routes = [
  {
    path: 'match-impro',
    component: MatchImproMessages,
  },
  {
    path: 'broadcast-messages',
    component: BroadcastMessages,
  },
  {
    path: '',
    redirectTo: 'broadcast-messages',
    pathMatch: 'full',
  },
];
