import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  providers: [CurrencyPipe],
})
export class TransactionFormComponent {
  @Output() submitTransaction = new EventEmitter<number>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private currencyPipe: CurrencyPipe) {
    this.form = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.submitTransaction.emit(this.form.value.amount);
      this.form.reset();
    }
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numericValue = Number(input.value.replace(/\D/g, ''));

    // Actualizamos el valor numérico en el form control
    this.form.controls['amount'].setValue(numericValue, { emitEvent: false });

    // Actualizamos la vista del input formateada
    input.value =
      this.currencyPipe.transform(numericValue, 'COP', '$', '1.0-0') || '';
  }
}
