import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'cotrafa-transactions-system';

  // Señal para dark mode
  // isDarkMode = signal(false);

  constructor(public themeService: ThemeService) {}

  // Función para alternar modo
  // toggleDarkMode() {
  //   this.isDarkMode.set(!this.isDarkMode());

  //   //  Aplicar clase 'dark' al html
  //   const html = document.documentElement;
  //   if (this.isDarkMode()) html.classList.add('dark');
  //   else html.classList.remove('dark');
  // }
}
