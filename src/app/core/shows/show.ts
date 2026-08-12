export interface ShowVenue {
  readonly name: string;
  readonly url: string;
}

export interface Show {
  readonly id: string;
  /** Jour du mois, tel qu'affiché sur la tuile de date — ex. '1'. */
  readonly day: string;
  /** Mois abrégé, tel qu'affiché sur la tuile de date — ex. 'sept.'. */
  readonly month: string;
  /** Intitulé complet de la date — ex. 'Mardi 1er septembre — 19h30'. */
  readonly title: string;
  /** Page du spectacle. */
  readonly url: string;
  readonly venue: ShowVenue;
}
