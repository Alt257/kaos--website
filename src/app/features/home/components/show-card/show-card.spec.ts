import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Show } from '../../../../core/shows/show';
import { ShowCard } from './show-card';

const SHOW: Show = {
  id: 'brassee-2026-10-06',
  title: 'Cabaret KAOS-tik !',
  startAt: new Date('2026-10-06T19:30'),
  description: "Cabaret d'impro avec une surprise en 2ième partie !",
  url: 'https://www.labrassee.cafe/scene',
  venue: { name: 'Café la Brassée', url: 'https://www.labrassee.cafe/' },
};

describe('ShowCard', () => {
  let fixture: ComponentFixture<ShowCard>;

  const card = () => fixture.nativeElement.querySelector('article');
  const query = (selector: string) => fixture.nativeElement.querySelector(selector);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowCard);
    fixture.componentRef.setInput('show', SHOW);
    await fixture.whenStable();
  });

  it('rend la date et le titre du spectacle', () => {
    expect(query('.show-card__day').textContent).toContain('1');
    expect(query('.show-card__month').textContent).toContain('sept.');
    expect(query('.show-card__title').textContent).toContain('Cabaret KAOS-tik !');
  });

  it('lie le titre au spectacle et le lieu à son site', () => {
    expect(query('.show-card__link').getAttribute('href')).toBe(SHOW.url);
    expect(query('.show-card__venue').getAttribute('href')).toBe(SHOW.venue.url);
  });

  it('affiche la description dans la variante par défaut', () => {
    expect(card().classList.contains('show-card--compact')).toBe(false);
    expect(query('.show-card__description')).not.toBeNull();
  });

  it('masque la description dans la variante compacte', async () => {
    fixture.componentRef.setInput('variant', 'compact');
    await fixture.whenStable();

    expect(card().classList.contains('show-card--compact')).toBe(true);
    expect(query('.show-card__description')).toBeNull();
  });
});
