import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionResultComponent } from './transaction-result.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('TransactionResultComponent', () => {
  let component: TransactionResultComponent;
  let fixture: ComponentFixture<TransactionResultComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionResultComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionResultComponent);
    component = fixture.componentInstance;

    // Inputs iniciales
    component.encryptedCus = 'ENC123456';
    component.originalCus = 'ORIG789012';

    // Mock de traducciones
    translateService = TestBed.inject(TranslateService);
    spyOn(translateService, 'instant').and.callFake((key: string) => {
      const translations: { [key: string]: string } = {
        'TRANSACTION_RESULT.TITLE': 'Transaction Result',
        'TRANSACTION_RESULT.ENCRYPTED_CUS': 'Encrypted CUS',
        'TRANSACTION_RESULT.HIDE_ORIGINAL': 'Hide Original',
        'TRANSACTION_RESULT.SHOW_ORIGINAL': 'Show Original',
      };
      return translations[key] || key;
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should accept encryptedCus input', () => {
      expect(component.encryptedCus).toBe('ENC123456');
    });

    it('should accept originalCus input', () => {
      expect(component.originalCus).toBe('ORIG789012');
    });

    it('should update when inputs change', () => {
      component.encryptedCus = 'NEW-ENC';
      component.originalCus = 'NEW-ORIG';
      fixture.detectChanges();

      expect(component.encryptedCus).toBe('NEW-ENC');
      expect(component.originalCus).toBe('NEW-ORIG');
    });
  });

  describe('Initial state', () => {
    it('should have showOriginal as false by default', () => {
      expect(component.showOriginal).toBeFalse();
    });
  });

  describe('toggleOriginal method', () => {
    it('should toggle showOriginal from false to true and back', () => {
      expect(component.showOriginal).toBeFalse();
      component.toggleOriginal();
      expect(component.showOriginal).toBeTrue();
      component.toggleOriginal();
      expect(component.showOriginal).toBeFalse();
    });

    it('should toggle multiple times correctly', () => {
      component.showOriginal = false;
      component.toggleOriginal(); // true
      component.toggleOriginal(); // false
      component.toggleOriginal(); // true
      expect(component.showOriginal).toBeTrue();
    });
  });

  describe('Template rendering', () => {
    it('should display encrypted CUS initially', () => {
      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements[0].nativeElement.textContent).toContain('ENC123456');
    });

    it('should not display original CUS initially', () => {
      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements.length).toBe(1);
      expect(codeElements[0].nativeElement.textContent).not.toContain(
        'ORIG789012'
      );
    });

    it('should display original CUS when showOriginal is true', () => {
      component.showOriginal = true;
      fixture.detectChanges();

      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements.length).toBe(2);
      expect(codeElements[1].nativeElement.textContent).toContain('ORIG789012');
    });

    it('should toggle button text correctly', () => {
      const button = fixture.debugElement.query(By.css('button'));

      // Inicial: Show Original
      expect(button.nativeElement.textContent).toContain('Show Original');

      component.toggleOriginal();
      fixture.detectChanges();

      // Luego: Hide Original
      expect(button.nativeElement.textContent).toContain('Hide Original');
    });

    it('should update displayed CUS when inputs change', () => {
      component.encryptedCus = 'NEW-ENCRYPTED';
      component.originalCus = 'NEW-ORIGINAL';
      component.showOriginal = true;
      fixture.detectChanges();

      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements[0].nativeElement.textContent).toContain(
        'NEW-ENCRYPTED'
      );
      expect(codeElements[1].nativeElement.textContent).toContain(
        'NEW-ORIGINAL'
      );
    });

    it('should have title with correct translation', () => {
      const title = fixture.debugElement.query(By.css('h3'));
      expect(title.nativeElement.textContent).toContain('Transaction Result');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty CUS values', () => {
      component.encryptedCus = '';
      component.originalCus = '';
      component.showOriginal = true;
      fixture.detectChanges();

      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements[0].nativeElement.textContent.trim()).toBe('');
      expect(codeElements[1].nativeElement.textContent.trim()).toBe('');
    });

    it('should handle very long CUS values', () => {
      const longCus = 'A'.repeat(1000);
      component.encryptedCus = longCus;
      component.originalCus = longCus;
      component.showOriginal = true;
      fixture.detectChanges();

      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements[0].nativeElement.textContent.length).toBe(1000);
      expect(codeElements[1].nativeElement.textContent.length).toBe(1000);
    });

    it('should handle special characters in CUS', () => {
      component.encryptedCus = 'ENC@#$%^&*()_+';
      component.originalCus = 'ORIG!@#$%^&*()';
      component.showOriginal = true;
      fixture.detectChanges();

      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements[0].nativeElement.textContent).toBe('ENC@#$%^&*()_+');
      expect(codeElements[1].nativeElement.textContent).toBe('ORIG!@#$%^&*()');
    });
  });

  describe('Integration tests', () => {
    it('should reflect all state changes in the template', () => {
      const button = fixture.debugElement.query(By.css('button'));

      expect(component.showOriginal).toBeFalse();
      expect(button.nativeElement.textContent).toContain('Show Original');

      component.toggleOriginal();
      fixture.detectChanges();

      const codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements.length).toBe(2);
      expect(codeElements[1].nativeElement.textContent).toContain('ORIG789012');
      expect(button.nativeElement.textContent).toContain('Hide Original');
    });

    it('should work with multiple toggles and input changes', () => {
      const button = fixture.debugElement.query(By.css('button'));

      component.toggleOriginal(); // true
      component.toggleOriginal(); // false

      component.encryptedCus = 'UPDATED-ENC';
      component.originalCus = 'UPDATED-ORIG';
      fixture.detectChanges();

      let codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements[0].nativeElement.textContent).toContain(
        'UPDATED-ENC'
      );
      expect(button.nativeElement.textContent).toContain('Show Original');

      component.toggleOriginal(); // true
      fixture.detectChanges();

      codeElements = fixture.debugElement.queryAll(By.css('code'));
      expect(codeElements[1].nativeElement.textContent).toContain(
        'UPDATED-ORIG'
      );
      expect(button.nativeElement.textContent).toContain('Hide Original');
    });
  });
});
