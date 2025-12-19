// src/app/shared/components/header/header.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();

  onMenuClick() {
    this.menuToggle.emit();
  }
}
