import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users'] && changes['users'].currentValue) {
      this.filteredUsers = [...this.users];
      this.currentPage = 1;
      this.updatePagination();
    }
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = value;

    this.filteredUsers = this.users.filter((user) =>
      `${user.name} ${user.email} ${user.city} ${user.country}`
        .toLowerCase()
        .includes(value)
    );

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const source = this.searchTerm ? this.filteredUsers : this.users;
    this.totalPages = Math.ceil(this.users.length / this.pageSize);

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = source.slice(start, end);
  }

  selectUser(userId: string): void {
    this.userSelected.emit(userId);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagination();
  }
}
