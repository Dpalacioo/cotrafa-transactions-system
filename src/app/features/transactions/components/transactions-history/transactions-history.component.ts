import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../shared/models';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';

@Component({
  selector: 'app-transactions-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions-history.component.html',
  styleUrls: ['./transactions-history.component.scss'],
})
export class TransactionsHistoryComponent implements OnInit {
  // Signal para manejar el historial
  transactions = signal<Transaction[]>([]);

  constructor(private transactionsRepo: TransactionsRepository) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const savedTransactions = this.transactionsRepo.getAll();
    this.transactions.set(savedTransactions);
  }
}
