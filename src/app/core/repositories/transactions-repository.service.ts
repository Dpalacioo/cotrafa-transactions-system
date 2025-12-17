import { Injectable } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionsRepository {
  private readonly STORAGE_KEY = 'transactions';

  constructor() {}

  getAll(): Transaction[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  save(transaction: Transaction): void {
    const transactions = this.getAll();
    transactions.push(transaction);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }
}