import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-transactions-history',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.scss'],
})
export class TransactionsHistoryComponent {
  toastMessage: string | null = null;
  showDeleteModal = false;
  transactionToDelete: string | null = null;

  constructor(private transactionsRepo: TransactionsRepository) {}

  get transactions() {
    return this.transactionsRepo.transactions;
  }

  copyCus(cus: string): void {
    navigator.clipboard.writeText(cus);
    this.showToast('CUS copiado.');
  }

  openDeleteModal(id: string): void {
    this.transactionToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.transactionToDelete) {
      this.transactionsRepo.delete(this.transactionToDelete);
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
