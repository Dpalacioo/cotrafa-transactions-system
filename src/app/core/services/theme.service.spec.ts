import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.Spy;
  let addClassSpy: jasmine.Spy;
  let removeClassSpy: jasmine.Spy;

  beforeEach(() => {
    addClassSpy = jasmine.createSpy('add');
    removeClassSpy = jasmine.createSpy('remove');

    const mockHtmlElement = {
      classList: {
        add: addClassSpy,
        remove: removeClassSpy,
      },
    };

    Object.defineProperty(window.document, 'documentElement', {
      value: mockHtmlElement,
      writable: true,
    });

    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      providers: [ThemeService],
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    addClassSpy.calls.reset();
    removeClassSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should load theme from localStorage if available', () => {
      localStorageSpy.and.returnValue('dark');
      const newService = new ThemeService();
      expect(newService.theme()).toBe('dark');
    });

    it('should default to light theme when localStorage is empty', () => {
      localStorageSpy.and.returnValue(null);
      const newService = new ThemeService();
      expect(newService.theme()).toBe('light');
    });

    it('should default to light theme when localStorage has invalid value', () => {
      localStorageSpy.and.returnValue('invalid');
      const newService = new ThemeService();
      expect(newService.theme()).toBe('light');
    });

    it('should apply initial theme on construction', () => {
      expect(addClassSpy).toHaveBeenCalledWith('dark');
    });
  });

  describe('toggle method', () => {
    it('should toggle from light to dark', () => {
      localStorageSpy.and.returnValue('light');
      const newService = new ThemeService();
      newService.toggle();
      expect(newService.theme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      localStorageSpy.and.returnValue('dark');
      const newService = new ThemeService();
      newService.toggle();
      expect(newService.theme()).toBe('light');
    });

    it('should call setTheme with correct next theme', () => {
      spyOn(service, 'setTheme');
      service.toggle();
      expect(service.setTheme).toHaveBeenCalledWith('dark');
    });

    it('should persist toggled theme to localStorage', () => {
      service.setTheme('light');
      service.toggle();
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('setTheme method', () => {
    it('should set theme to dark', () => {
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
    });

    it('should set theme to light', () => {
      service.setTheme('dark');
      service.setTheme('light');
      expect(service.theme()).toBe('light');
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    it('should call applyTheme with the theme', () => {
      spyOn(service as any, 'applyTheme');
      service.setTheme('dark');
      expect((service as any).applyTheme).toHaveBeenCalledWith('dark');
    });

    it('should update signal when theme changes', () => {
      const initialTheme = service.theme();
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
      expect(service.theme()).not.toBe(initialTheme);
    });
  });

  describe('applyTheme method', () => {
    it('should add dark class for dark theme', () => {
      (service as any).applyTheme('dark');
      expect(addClassSpy).toHaveBeenCalledWith('dark');
      expect(removeClassSpy).not.toHaveBeenCalled();
    });

    it('should remove dark class for light theme', () => {
      (service as any).applyTheme('light');
      expect(removeClassSpy).toHaveBeenCalledWith('dark');
      expect(addClassSpy).not.toHaveBeenCalled();
    });

    it('should handle multiple theme changes', () => {
      (service as any).applyTheme('dark');
      (service as any).applyTheme('light');
      (service as any).applyTheme('dark');

      expect(addClassSpy).toHaveBeenCalledTimes(2);
      expect(removeClassSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadTheme method', () => {
    it('should return theme from localStorage', () => {
      localStorageSpy.and.returnValue('dark');
      expect((service as any).loadTheme()).toBe('dark');
    });

    it('should return light when localStorage is empty', () => {
      localStorageSpy.and.returnValue(null);
      expect((service as any).loadTheme()).toBe('light');
    });

    it('should return light when localStorage value is not a valid theme', () => {
      localStorageSpy.and.returnValue('invalid-theme');
      expect((service as any).loadTheme()).toBe('light');
    });
  });

  describe('theme signal', () => {
    it('should be readonly', () => {
      expect(() => {
        (service as any).theme.set('dark');
      }).toThrow();
    });

    it('should reflect current theme state', () => {
      expect(service.theme()).toBe('light');
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');
      service.toggle();
      expect(service.theme()).toBe('light');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid theme changes', () => {
      service.setTheme('dark');
      service.setTheme('light');
      service.setTheme('dark');
      service.toggle();
      service.toggle();

      expect(service.theme()).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledTimes(5);
    });

    it('should maintain consistency between localStorage and theme', () => {
      service.setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(service.theme()).toBe('dark');

      localStorageSpy.and.returnValue('light');
      const newService = new ThemeService();
      expect(newService.theme()).toBe('light');
    });

    it('should handle empty string in localStorage', () => {
      localStorageSpy.and.returnValue('');
      const newService = new ThemeService();
      expect(newService.theme()).toBe('light');
    });

    it('should handle undefined in localStorage', () => {
      localStorageSpy.and.returnValue(undefined as any);
      const newService = new ThemeService();
      expect(newService.theme()).toBe('light');
    });
  });

  describe('Integration', () => {
    it('should sync theme between multiple service instances', () => {
      const service1 = new ThemeService();
      service1.setTheme('dark');

      localStorageSpy.and.returnValue('dark');
      const service2 = new ThemeService();

      expect(service1.theme()).toBe('dark');
      expect(service2.theme()).toBe('dark');
    });

    it('should apply theme to document on service creation', () => {
      localStorageSpy.and.returnValue('dark');
      new ThemeService();
      expect(addClassSpy).toHaveBeenCalledWith('dark');
    });
  });
});
