import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../shared/models';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionResultComponent } from '../transaction-result/transaction-result.component';

@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    TransactionFormComponent,
    TransactionResultComponent,
  ],
  templateUrl: './user-selector.component.html',
})
export class UserSelectorComponent implements OnInit, OnChanges {
  @Input({ required: true }) users: User[] = [];
  @Input() userLastTransactionCus: Map<
    string,
    { encrypted: string; original: string }
  > = new Map();
  @Output() userSelected = new EventEmitter<string>();
  @Output() transactionSubmit = new EventEmitter<{
    amount: number;
    userId: string;
  }>();

  paginatedUsers: User[] = [];
  filteredUsers: User[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];

  searchTerm = '';
  selectedUserId: string | null = null;

  usersWithFormVisible = new Set<string>();

  toastMessage: string | null = null;

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users']) {
      this.applyFilter();
    }

    // Se ejecuta al cambiar de pestaña)
    if (changes['userLastTransactionCus']) {
      this.usersWithFormVisible.clear();
      this.selectedUserId = null;
    }
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter((user) =>
        `${user.name} ${user.email} ${user.city} ${user.country}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    } else {
      this.filteredUsers = [...this.users];
    }

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePagination();
  }

  selectUser(userId: string): void {
    // Si ya estaba seleccionado, Se quita selección
    if (this.selectedUserId === userId) {
      this.selectedUserId = null;
      this.usersWithFormVisible.delete(userId);
    } else {
      this.selectedUserId = userId;
      // Solo se muestra el formulario si no hay transacción reciente
      if (!this.getUserLastCus(userId)) {
        this.usersWithFormVisible.add(userId);
      }
    }
    this.userSelected.emit(userId);
  }

  onTransactionSubmit(amount: number, userId: string): void {
    this.transactionSubmit.emit({ amount, userId });
    // Se oculta el formulario después de enviar
    this.usersWithFormVisible.delete(userId);

    this.showToast('Transacción guardada correctamente');
  }

  // Para iniciar una nueva transacción
  startNewTransaction(userId: string): void {
    // Se limpia la transacción actual para este usuario
    this.userLastTransactionCus.delete(userId);
    // Se muestra el formulario
    this.usersWithFormVisible.add(userId);
  }

  getUserLastCus(
    userId: string
  ): { encrypted: string; original: string } | undefined {
    return this.userLastTransactionCus.get(userId);
  }

  // Para verificar si el formulario debe mostrarse
  shouldShowForm(userId: string): boolean {
    return (
      this.usersWithFormVisible.has(userId) && !this.getUserLastCus(userId)
    );
  }

  // Para verificar si debe mostrarse el botón "Nueva transacción"
  shouldShowNewTransactionButton(userId: string): boolean {
    return (
      this.getUserLastCus(userId) !== undefined &&
      !this.usersWithFormVisible.has(userId)
    );
  }

  showToast(message: string): void {
    this.toastMessage = message;

    setTimeout(() => {
      this.toastMessage = null;
    }, 2000);
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}
