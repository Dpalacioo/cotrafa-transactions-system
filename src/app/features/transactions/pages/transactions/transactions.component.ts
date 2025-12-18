import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersStore } from '../../../../core/store/users.store';
import { UserSelectorComponent } from '../../components/user-selector/user-selector.component';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { CusEncryptionService } from '../../../../core/services/cus-encryption.service';
import { Transaction } from '../../../../shared/models';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';
import { TransactionsHistoryComponent } from '../../components/transactions-history/transactions-history.component';
import { TransactionResultComponent } from '../../components/transaction-result/transaction-result.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    UserSelectorComponent,
    TransactionFormComponent,
    TransactionsHistoryComponent,
    TransactionResultComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  selectedUserId: string | null = null;
  lastTransactionCus: {
    encrypted: string;
    original: string;
  } | null = null;

  constructor(
    public usersStore: UsersStore,
    private cusService: CusEncryptionService,
    private transactionsRepo: TransactionsRepository
  ) {}

  ngOnInit(): void {
    this.usersStore.loadUsers();
  }

  onUserSelected(userId: string): void {
    this.selectedUserId = userId;
  }

  onTransactionSubmit(amount: number): void {
    if (!this.selectedUserId) return;

    // Buscar usuario seleccionado
    const user = this.usersStore
      .users()
      .find((u) => u.id === this.selectedUserId);
    if (!user) return;

    // Generar CUS
    const cusOriginal = this.cusService.generateCus(user.id);
    const cusEncrypted = this.cusService.encrypt(cusOriginal);

    this.lastTransactionCus = {
      original: cusOriginal,
      encrypted: cusEncrypted,
    };

    // Crear transacción
    const transaction: Transaction = {
      id: cusOriginal,
      user,
      amount,
      cus: { original: cusOriginal, encrypted: cusEncrypted },
      createdAt: new Date(),
    };

    // Guardar en repositorio local
    this.transactionsRepo.save(transaction);

    // Limpiar selección
    this.selectedUserId = null;
  }
}
