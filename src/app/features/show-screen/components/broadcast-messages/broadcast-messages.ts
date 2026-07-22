import { Component, signal } from '@angular/core';
import { Message } from '../../models/message';

@Component({
  selector: 'app-broadcast-messages',
  imports: [],
  templateUrl: './broadcast-messages.html',
  styleUrl: './broadcast-messages.css',
})
export class BroadcastMessages {
  message = signal<Message>({ content: 'coucou' });
}
