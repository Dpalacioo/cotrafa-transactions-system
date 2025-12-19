import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule, TranslateModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Cotrafa Transactions System';

  constructor(
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}
}
