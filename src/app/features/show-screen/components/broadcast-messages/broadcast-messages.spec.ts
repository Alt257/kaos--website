import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastMessages } from './broadcast-messages';

describe('BroadcastMessages', () => {
  let component: BroadcastMessages;
  let fixture: ComponentFixture<BroadcastMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcastMessages],
    }).compileComponents();

    fixture = TestBed.createComponent(BroadcastMessages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
