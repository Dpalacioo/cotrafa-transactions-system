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

@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-selector.component.html',
})
export class UserSelectorComponent implements OnInit, OnChanges {
  @Input({ required: true }) users: User[] = [];
  @Output() userSelected = new EventEmitter<string>();

  paginatedUsers: User[] = [];
  filteredUsers: User[] = [];

  currentPage = 1;
  pageSize = 12;
  totalPages = 0;
  pages: number[] = [];

  searchTerm = '';
  selectedUserId: string | null = null;

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users']) {
      this.applyFilter();
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
    this.selectedUserId = userId;
    this.userSelected.emit(userId);
  }

  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}
