import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchImproMessages } from './match-impro-messages';

describe('MatchImproMessages', () => {
  let component: MatchImproMessages;
  let fixture: ComponentFixture<MatchImproMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchImproMessages],
    }).compileComponents();

    fixture = TestBed.createComponent(MatchImproMessages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
