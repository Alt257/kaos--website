import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Message } from '../../models/message';

@Component({
  selector: 'app-broadcast-messages',
  imports: [],
  templateUrl: './broadcast-messages.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './broadcast-messages.css',
})
export class BroadcastMessages implements OnInit {
  message = signal<Message>({ content: 'ahke...' });
  ngOnInit(): void {
    setTimeout(() => {
      this.message.set({ content: 'coucou' });
    }, 1500);
  }
}
