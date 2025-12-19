import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLanguage = signal<'es' | 'en'>('es');

  constructor(private translate: TranslateService) {
    // Configura idiomas disponibles
    this.translate.addLangs(['es', 'en']);

    // Establecer idioma por defecto
    this.translate.setDefaultLang('es');

    // Restaura idioma guardado
    this.restoreLanguage();
  }

  // Método para restaurar idioma desde localStorage
  private restoreLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') as 'es' | 'en';

    // Valida que el idioma guardado sea válido
    if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
      this.setLanguage(savedLang);
    } else {
      // Si no hay idioma guardado, usa el del navegador
      const browserLang = this.translate.getBrowserLang();
      const langToUse =
        browserLang === 'es' || browserLang === 'en'
          ? (browserLang as 'es' | 'en')
          : 'es';

      this.setLanguage(langToUse);
    }
  }

  setLanguage(lang: 'es' | 'en') {
    this.currentLanguage.set(lang);
    this.translate.use(lang);
    // Guardar preferencia de idioma
    localStorage.setItem('preferredLanguage', lang);
  }

  toggleLanguage() {
    const newLang = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  getCurrentLanguage(): 'es' | 'en' {
    return this.currentLanguage();
  }
}
