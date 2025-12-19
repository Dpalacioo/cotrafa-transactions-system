import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionFormComponent } from './transaction-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

describe('TransactionFormComponent', () => {
  let component: TransactionFormComponent;
  let fixture: ComponentFixture<TransactionFormComponent>;
  // Ya no inyectamos CurrencyPipe globalmente si el componente tiene su propio provider

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionFormComponent,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      // No es estrictamente necesario el provider aquí si el componente ya lo tiene
      providers: [FormBuilder, CurrencyPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onAmountInput method', () => {
    it('should format input value with currency pipe', () => {
      const mockInput = { value: '50000' } as HTMLInputElement;
      const mockEvent = { target: mockInput } as unknown as Event;

      // ACCESO CORRECTO AL PIPE:
      // Accedemos a la instancia privada que el componente realmente usa
      const pipe = (component as any).currencyPipe;
      spyOn(pipe, 'transform').and.returnValue('$50,000');

      component.onAmountInput(mockEvent);

      expect(mockInput.value).toBe('$50,000');
      expect(pipe.transform).toHaveBeenCalledWith(50000, 'COP', '$', '1.0-0');
    });
  });

  describe('Template integration', () => {
    // Helper para encontrar el input de forma más segura
    const getAmountInput = () =>
      fixture.nativeElement.querySelector('input[formControlName="amount"]') ||
      fixture.nativeElement.querySelector('input');

    it('should have amount input field', () => {
      const input = getAmountInput();
      expect(input)
        .withContext('No se encontró el input en el HTML')
        .toBeTruthy();
    });

    it('should call onAmountInput on input event', () => {
      spyOn(component, 'onAmountInput');
      const input = getAmountInput();

      if (!input) {
        fail('No se pudo ejecutar el test porque el input es null');
        return;
      }

      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.onAmountInput).toHaveBeenCalled();
    });
  });
});
