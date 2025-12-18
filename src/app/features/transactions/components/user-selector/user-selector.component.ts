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
  pages: (number | string)[] = [];

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
    this.pages = this.generatePaginationArray();

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  generatePaginationArray(): (number | string)[] {
    const maxVisiblePages = 5;
    const pages: (number | string)[] = [];

    if (this.totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si hay 5 o menos
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1);

      let start: number;
      let end: number;

      if (this.currentPage <= 3) {
        // Caso 1: Estamos cerca del inicio (páginas 1-3)
        start = 2;
        end = Math.min(4, this.totalPages - 1);
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        if (end < this.totalPages - 1) {
          pages.push('...');
        }
      } else if (this.currentPage >= this.totalPages - 2) {
        // Caso 2: Estamos cerca del final
        pages.push('...');
        start = Math.max(this.totalPages - 3, 2);
        end = this.totalPages - 1;
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      } else {
        // Caso 3: Estamos en el medio
        pages.push('...');
        start = this.currentPage - 1;
        end = this.currentPage + 1;
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        pages.push('...');
      }

      // Siempre mostrar la última página
      pages.push(this.totalPages);
    }

    return pages;
  }

  goToPage(page: number | string): void {
    // Ignorar si es string (los puntos suspensivos)
    if (typeof page !== 'number') {
      return;
    }

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
