/** Informations sur le lieu de spectacle */
export interface ShowVenue {
  /** Nom du lieu — ex. 'La Brassée' */
  readonly name: string;
  /** site web du lieu */
  readonly url: string;
}

/** Informations d'un spectacle d'impro */
export interface Show {
  /** UUID */
  readonly id: string;
  /** Date et heure du show */
  readonly startAt: Date;
  /** Intitulé complet du show — ex. 'Cabaret KAOS-tic !'. */
  readonly title: string;
  /** Description de l'évènement — ex. 'Cabaret d'impro en 2 parties de 45 min'. */
  readonly description: string;
  /** Page du spectacle. */
  readonly url: string;
  /** Lieu où se déroule le spectacle */
  readonly venue: ShowVenue;
}
