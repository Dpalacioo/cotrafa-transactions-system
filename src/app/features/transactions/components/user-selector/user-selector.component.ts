import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../shared/models';

@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-selector.component.html',
})
export class UserSelectorComponent {
  @Input({ required: true }) users: User[] = [];
  @Output() userSelected = new EventEmitter<string>();

  selectUser(userId: string): void {
    this.userSelected.emit(userId);
  }
}
