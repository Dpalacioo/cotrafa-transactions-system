import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-transaction-result',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './transaction-result.component.html',
})
export class TransactionResultComponent {
  @Input({ required: true }) encryptedCus!: string;
  @Input({ required: true }) originalCus!: string;

  showOriginal = false;

  toggleOriginal(): void {
    this.showOriginal = !this.showOriginal;
  }
}
