import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.scss'],
})
export class TransactionsHistoryComponent {
  @Output() transactionsChanged = new EventEmitter<void>();
  toastMessage: string | null = null;
  showDeleteModal = false;
  transactionToDelete: string | null = null;

  constructor(
    private transactionsRepo: TransactionsRepository,
    private translate: TranslateService
  ) {}

  get transactions() {
    return this.transactionsRepo.transactions;
  }

  copyCus(cus: string): void {
    navigator.clipboard.writeText(cus);
    const message = this.translate.instant('TRANSACTION_HISTORY.TOAST.COPIED');
    this.showToast(message);
  }

  openDeleteModal(id: string): void {
    this.transactionToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.transactionToDelete) {
      this.transactionsRepo.delete(this.transactionToDelete);
      setTimeout(() => {
        this.transactionsChanged.emit();
      }, 0);
    }

    this.closeModal();
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.transactionToDelete = null;
  }

  deleteTransaction(transactionId: string): void {
    this.transactionsRepo.delete(transactionId);
  }

  showToast(message: string): void {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }
}
