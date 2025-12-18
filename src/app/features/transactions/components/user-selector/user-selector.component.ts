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
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;
  pages: number[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users'] && changes['users'].currentValue) {
      this.currentPage = 1;
      this.updatePagination();
    }
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.users.length / this.pageSize);

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
    // this.cdr.detectChanges();
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
