import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'cotrafa-transactions-system';

  // Señal para dark mode
  isDarkMode = signal(false);

  // Función para alternar modo
  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());

    //  Aplicar clase 'dark' al html
    const html = document.documentElement;
    if (this.isDarkMode()) html.classList.add('dark');
    else html.classList.remove('dark');
  }
}
