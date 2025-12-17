import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersStore } from '../../../../core/store/users.store';
import { UserSelectorComponent } from '../../components/user-selector/user-selector.component';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, UserSelectorComponent, TransactionFormComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  selectedUserId: string | null = null;

  constructor(public usersStore: UsersStore) {}

  ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  onUserSelected(userId: string): void {
    this.selectedUserId = userId;
  }

  onTransactionSubmit(amount: number): void {
    if (!this.selectedUserId) return;

    console.log('Transacción:', {
      userId: this.selectedUserId,
      amount,
    });
  }
}
