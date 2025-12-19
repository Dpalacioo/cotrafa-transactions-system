// src/app/shared/components/sidebar/sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() close = new EventEmitter<void>();
  @Output() toggleCollapse = new EventEmitter<void>();

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

  onNavClick() {
    this.close.emit();
  }

  onToggleCollapse() {
    this.toggleCollapse.emit();
  }
}
