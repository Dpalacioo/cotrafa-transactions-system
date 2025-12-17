import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersStore } from '../../../../core/store/users.store';
import { UserSelectorComponent } from '../../components/user-selector/user-selector.component';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';
import { CusEncryptionService } from '../../../../core/services/cus-encryption.service';
import { Transaction } from '../../../../shared/models';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, UserSelectorComponent, TransactionFormComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  selectedUserId: string | null = null;

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

    // Crear transacción
    const transaction: Transaction = {
      id: cusOriginal, // puedes usar cusOriginal como ID
      user,
      amount,
      cus: { original: cusOriginal, encrypted: cusEncrypted },
      createdAt: new Date(),
    };

    // Guardar en repositorio local
    this.transactionsRepo.save(transaction);
    console.log(this.transactionsRepo.getAll());

    // Limpiar selección
    this.selectedUserId = null;
  }
}
