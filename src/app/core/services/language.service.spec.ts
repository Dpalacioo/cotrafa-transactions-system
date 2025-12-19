import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';
import { TranslateService } from '@ngx-translate/core';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', [
      'addLangs',
      'setDefaultLang',
      'use',
      'getBrowserLang',
    ]);

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: translateSpy },
      ],
    });

    translateService = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;

    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  it('should be created', () => {
    service = TestBed.inject(LanguageService);
    expect(service).toBeTruthy();
  });

  describe('restoreLanguage on init', () => {
    it('should use language from localStorage if present', () => {
      localStorage.setItem('preferredLanguage', 'en');
      service = new LanguageService(translateService);
      expect(service.getCurrentLanguage()).toBe('en');
      expect(translateService.use).toHaveBeenCalledWith('en');
    });

    it('should use browser language if no localStorage', () => {
      translateService.getBrowserLang.and.returnValue('en');
      service = new LanguageService(translateService);
      expect(service.getCurrentLanguage()).toBe('en');
      expect(translateService.use).toHaveBeenCalledWith('en');
    });

    it('should default to "es" if localStorage and browser language invalid', () => {
      localStorage.setItem('preferredLanguage', 'fr'); // inválido
      translateService.getBrowserLang.and.returnValue('de'); // tampoco soportado
      service = new LanguageService(translateService);
      expect(service.getCurrentLanguage()).toBe('es');
      expect(translateService.use).toHaveBeenCalledWith('es');
    });
  });

  describe('setLanguage', () => {
    beforeEach(() => {
      service = new LanguageService(translateService);
    });

    it('should set signal, use TranslateService and save to localStorage', () => {
      service.setLanguage('en');
      expect(service.getCurrentLanguage()).toBe('en');
      expect(translateService.use).toHaveBeenCalledWith('en');
      expect(localStorage.getItem('preferredLanguage')).toBe('en');
    });
  });

  describe('toggleLanguage', () => {
    beforeEach(() => {
      service = new LanguageService(translateService);
    });

    it('should toggle from "es" to "en"', () => {
      service.setLanguage('es');
      service.toggleLanguage();
      expect(service.getCurrentLanguage()).toBe('en');
    });

    it('should toggle from "en" to "es"', () => {
      service.setLanguage('en');
      service.toggleLanguage();
      expect(service.getCurrentLanguage()).toBe('es');
    });

    it('should call setLanguage internally', () => {
      spyOn(service, 'setLanguage').and.callThrough();
      service.setLanguage('es');
      service.toggleLanguage();
      expect(service.setLanguage).toHaveBeenCalledWith('en');
    });
  });

  describe('getCurrentLanguage', () => {
    beforeEach(() => {
      service = new LanguageService(translateService);
    });

    it('should return current language', () => {
      service.setLanguage('es');
      expect(service.getCurrentLanguage()).toBe('es');
      service.setLanguage('en');
      expect(service.getCurrentLanguage()).toBe('en');
    });

    it('currentLanguage signal should reflect updates', () => {
      service.setLanguage('en');
      expect(service.currentLanguage()).toBe('en');
      service.toggleLanguage();
      expect(service.currentLanguage()).toBe('es');
    });
  });

  describe('TranslateService configuration on init', () => {
    it('should add languages and set default language', () => {
      service = new LanguageService(translateService);
      expect(translateService.addLangs).toHaveBeenCalledWith(['es', 'en']);
      expect(translateService.setDefaultLang).toHaveBeenCalledWith('es');
    });
  });
});
