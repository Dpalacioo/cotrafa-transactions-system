import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersStore } from '../../../../core/store/users.store';
import { UserSelectorComponent } from '../../components/user-selector/user-selector.component';
import { CusEncryptionService } from '../../../../core/services/cus-encryption.service';
import { Transaction } from '../../../../shared/models';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';
import { TransactionsHistoryComponent } from '../../components/transactions-history/transactions-history.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, UserSelectorComponent, TransactionsHistoryComponent],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  selectedUserId: string | null = null;
  userLastTransactionsCus: Map<
    string,
    { encrypted: string; original: string }
  > = new Map();

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

  // Nuevo método para manejar transacciones desde el user-selector
  onTransactionSubmitFromSelector(event: {
    amount: number;
    userId: string;
  }): void {
    this.selectedUserId = event.userId;
    this.processTransaction(event.amount, event.userId);
  }

  // Mantener el método original por compatibilidad
  onTransactionSubmit(amount: number): void {
    if (!this.selectedUserId) return;
    this.processTransaction(amount, this.selectedUserId);
  }

  // Método común para procesar transacciones
  private processTransaction(amount: number, userId: string): void {
    // Buscar usuario seleccionado
    const user = this.usersStore.users().find((u) => u.id === userId);
    if (!user) return;

    // Generar CUS
    const cusOriginal = this.cusService.generateCus(user.id);
    const cusEncrypted = this.cusService.encrypt(cusOriginal);

    // Guardar en el Map para este usuario específico
    this.userLastTransactionsCus.set(userId, {
      original: cusOriginal,
      encrypted: cusEncrypted,
    });

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
