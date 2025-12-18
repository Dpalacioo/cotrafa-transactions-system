import { Injectable, signal } from '@angular/core';
import { Transaction } from '../../shared/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionsRepository {
  private readonly STORAGE_KEY = 'transactions';

  private readonly _transactions = signal<Transaction[]>(
    this.loadFromStorage()
  );

  readonly transactions = this._transactions.asReadonly();

  private loadFromStorage(): Transaction[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    return JSON.parse(stored).map((tx: Transaction) => ({
      ...tx,
      createdAt: new Date(tx.createdAt),
    }));
  }

  save(transaction: Transaction): void {
    const updated = [transaction, ...this._transactions()];
    this.persist(updated);
  }

  delete(transactionId: string): void {
    const updated = this._transactions().filter(
      (tx) => tx.id !== transactionId
    );
    this.persist(updated);
  }

  clear(): void {
    this.persist([]);
  }

  private persist(transactions: Transaction[]): void {
    this._transactions.set(transactions);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
  }
}
