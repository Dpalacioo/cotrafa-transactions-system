import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UserSelectorComponent } from './user-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionResultComponent } from '../transaction-result/transaction-result.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('UserSelectorComponent', () => {
  let component: UserSelectorComponent;
  let fixture: ComponentFixture<UserSelectorComponent>;

  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      city: 'New York',
      country: 'USA',
      phone: '123-456-7890',
      picture: 'thumb1.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      city: 'London',
      country: 'UK',
      phone: '987-654-3210',
      picture: 'thumb2.jpg',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      city: 'Toronto',
      country: 'Canada',
      phone: '555-123-4567',
      picture: 'thumb3.jpg',
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      city: 'Sydney',
      country: 'Australia',
      phone: '777-888-9999',
      picture: 'thumb4.jpg',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserSelectorComponent,
        TranslateModule.forRoot(),
        MatExpansionModule,
        MatIconModule,
        TransactionFormComponent,
        TransactionResultComponent,
        CommonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSelectorComponent);
    component = fixture.componentInstance;
    component.users = mockUsers;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should initialize with empty userLastTransactionCus map', () => {
      expect(component.userLastTransactionCus.size).toBe(0);
    });

    it('should initialize with empty searchTerm', () => {
      expect(component.searchTerm).toBe('');
    });

    it('should initialize with page 1 and pageSize 10', () => {
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(10);
    });

    it('should initialize with null selectedUserId', () => {
      expect(component.selectedUserId).toBeNull();
    });

    it('should initialize with empty usersWithFormVisible set', () => {
      expect(component.usersWithFormVisible.size).toBe(0);
    });
  });

  describe('ngOnInit', () => {
    it('should set filteredUsers to all users', () => {
      expect(component.filteredUsers).toEqual(mockUsers);
    });

    it('should update pagination on init', () => {
      expect(component.paginatedUsers.length).toBeGreaterThan(0);
      expect(component.totalPages).toBe(1); // 4 users / 10 per page = 1 page
    });
  });

  describe('ngOnChanges', () => {
    it('should apply filter when users input changes', () => {
      const newUsers = [
        ...mockUsers,
        {
          id: '5',
          name: 'New User',
          email: 'new@example.com',
          city: 'Berlin',
          country: 'Germany',
          phone: '111-222-3333',
          picture: 'thumb5.jpg',
        },
      ];
      component.users = newUsers;
      component.ngOnChanges({
        users: {
          currentValue: newUsers,
          previousValue: mockUsers,
          firstChange: false,
          isFirstChange: () => false,
        },
      } as any);

      expect(component.filteredUsers).toEqual(newUsers);
    });

    it('should clear form visibility when userLastTransactionCus changes', () => {
      component.usersWithFormVisible.add('1');
      component.selectedUserId = '1';

      const newMap = new Map();
      newMap.set('1', { encrypted: 'ENC123', original: 'ORIG456' });
      component.userLastTransactionCus = newMap;
      component.ngOnChanges({
        userLastTransactionCus: {
          currentValue: newMap,
          previousValue: new Map(),
          firstChange: false,
          isFirstChange: () => false,
        },
      } as any);

      expect(component.usersWithFormVisible.size).toBe(0);
      expect(component.selectedUserId).toBeNull();
    });
  });

  describe('onSearch', () => {
    it('should filter users by search term', () => {
      const event = { target: { value: 'john' } } as any;
      component.onSearch(event);

      expect(component.searchTerm).toBe('john');
      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].name).toBe('John Doe');
    });

    it('should reset to page 1 when searching', () => {
      component.currentPage = 2;
      component.pageSize = 2; // Set smaller page size for testing
      component.updatePagination();

      const event = { target: { value: 'j' } } as any;
      component.onSearch(event);

      expect(component.currentPage).toBe(1);
    });

    it('should handle empty search term', () => {
      const event = { target: { value: '' } } as any;
      component.onSearch(event);

      expect(component.searchTerm).toBe('');
      expect(component.filteredUsers).toEqual(mockUsers);
    });
  });

  describe('applyFilter', () => {
    it('should filter by name', () => {
      component.searchTerm = 'jane';
      component.applyFilter();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].name).toBe('Jane Smith');
    });

    it('should filter by email', () => {
      component.searchTerm = 'bob@example.com';
      component.applyFilter();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].name).toBe('Bob Johnson');
    });

    it('should filter by city', () => {
      component.searchTerm = 'new york';
      component.applyFilter();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].name).toBe('John Doe');
    });

    it('should filter by country', () => {
      component.searchTerm = 'canada';
      component.applyFilter();

      expect(component.filteredUsers.length).toBe(1);
      expect(component.filteredUsers[0].name).toBe('Bob Johnson');
    });

    it('should return all users when search term is empty', () => {
      component.searchTerm = '';
      component.applyFilter();

      expect(component.filteredUsers).toEqual(mockUsers);
    });
  });

  describe('updatePagination', () => {
    beforeEach(() => {
      component.pageSize = 2; // Set smaller page size for testing
    });

    it('should calculate correct total pages', () => {
      component.updatePagination();
      expect(component.totalPages).toBe(2); // 4 users / 2 per page = 2 pages
    });

    it('should generate paginated users for current page', () => {
      component.currentPage = 1;
      component.updatePagination();
      expect(component.paginatedUsers.length).toBe(2);
      expect(component.paginatedUsers[0].name).toBe('John Doe');
      expect(component.paginatedUsers[1].name).toBe('Jane Smith');

      component.currentPage = 2;
      component.updatePagination();
      expect(component.paginatedUsers.length).toBe(2);
      expect(component.paginatedUsers[0].name).toBe('Bob Johnson');
      expect(component.paginatedUsers[1].name).toBe('Alice Brown');
    });
  });

  describe('generatePaginationArray', () => {
    beforeEach(() => {
      component.pageSize = 1;
    });

    it('should generate array with all pages when totalPages <= 5', () => {
      component.filteredUsers = mockUsers.slice(0, 3);
      component.updatePagination(); // totalPages = 3

      const pages = component.generatePaginationArray();
      expect(pages).toEqual([1, 2, 3]);
    });

    it('should generate ellipsis when currentPage is near start', () => {
      component.filteredUsers = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        city: 'Test',
        country: 'Test',
        phone: '123',
        picture: '',
      }));
      component.updatePagination(); // totalPages = 10
      component.currentPage = 2;

      const pages = component.generatePaginationArray();
      expect(pages).toEqual([1, 2, 3, 4, '...', 10]);
    });

    it('should generate ellipsis when currentPage is near end', () => {
      component.filteredUsers = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        city: 'Test',
        country: 'Test',
        phone: '123',
        picture: '',
      }));
      component.updatePagination(); // totalPages = 10
      component.currentPage = 9;

      const pages = component.generatePaginationArray();
      expect(pages).toEqual([1, '...', 7, 8, 9, 10]);
    });

    it('should generate ellipsis on both sides when currentPage is in middle', () => {
      component.filteredUsers = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        city: 'Test',
        country: 'Test',
        phone: '123',
        picture: '',
      }));
      component.updatePagination(); // totalPages = 10
      component.currentPage = 5;

      const pages = component.generatePaginationArray();
      expect(pages).toEqual([1, '...', 4, 5, 6, '...', 10]);
    });
  });

  describe('goToPage', () => {
    beforeEach(() => {
      component.pageSize = 2;
      component.updatePagination();
    });

    it('should change current page to valid number', () => {
      component.goToPage(2);
      expect(component.currentPage).toBe(2);
    });

    it('should ignore ellipsis string', () => {
      component.currentPage = 1;
      component.goToPage('...' as any);
      expect(component.currentPage).toBe(1);
    });

    it('should not go to page less than 1', () => {
      component.goToPage(0);
      expect(component.currentPage).toBe(1);
    });

    it('should not go to page greater than totalPages', () => {
      component.goToPage(5);
      expect(component.currentPage).toBe(1);
    });
  });

  describe('selectUser', () => {
    it('should select user when not selected', () => {
      spyOn(component.userSelected, 'emit');
      component.selectUser('1');

      expect(component.selectedUserId).toBe('1');
      expect(component.userSelected.emit).toHaveBeenCalledWith('1');
    });

    it('should deselect user when already selected', () => {
      component.selectedUserId = '1';
      spyOn(component.userSelected, 'emit');

      component.selectUser('1');

      expect(component.selectedUserId).toBeNull();
      expect(component.userSelected.emit).toHaveBeenCalledWith('1');
    });

    it('should add user to form visibility set when no last CUS', () => {
      component.selectUser('1');
      expect(component.usersWithFormVisible.has('1')).toBeTrue();
    });

    it('should not add user to form visibility set when has last CUS', () => {
      component.userLastTransactionCus.set('1', {
        encrypted: 'ENC123',
        original: 'ORIG456',
      });
      component.selectUser('1');
      expect(component.usersWithFormVisible.has('1')).toBeFalse();
    });

    it('should remove user from form visibility set when deselected', () => {
      component.usersWithFormVisible.add('1');
      component.selectedUserId = '1';

      component.selectUser('1');

      expect(component.usersWithFormVisible.has('1')).toBeFalse();
    });
  });

  describe('onTransactionSubmit', () => {
    it('should emit transactionSubmit event', () => {
      spyOn(component.transactionSubmit, 'emit');
      component.onTransactionSubmit(50000, '1');

      expect(component.transactionSubmit.emit).toHaveBeenCalledWith({
        amount: 50000,
        userId: '1',
      });
    });

    it('should remove user from form visibility set', () => {
      component.usersWithFormVisible.add('1');
      component.onTransactionSubmit(50000, '1');

      expect(component.usersWithFormVisible.has('1')).toBeFalse();
    });

    it('should show toast message', fakeAsync(() => {
      component.onTransactionSubmit(50000, '1');

      expect(component.toastMessage).toBe('Transacción guardada correctamente');
      tick(2000);
      expect(component.toastMessage).toBeNull();
    }));
  });

  describe('startNewTransaction', () => {
    it('should delete last CUS for user', () => {
      component.userLastTransactionCus.set('1', {
        encrypted: 'ENC123',
        original: 'ORIG456',
      });
      component.startNewTransaction('1');

      expect(component.userLastTransactionCus.get('1')).toBeUndefined();
    });

    it('should add user to form visibility set', () => {
      component.startNewTransaction('1');
      expect(component.usersWithFormVisible.has('1')).toBeTrue();
    });
  });

  describe('getUserLastCus', () => {
    it('should return CUS when exists', () => {
      const cus = { encrypted: 'ENC123', original: 'ORIG456' };
      component.userLastTransactionCus.set('1', cus);

      expect(component.getUserLastCus('1')).toEqual(cus);
    });

    it('should return undefined when CUS does not exist', () => {
      expect(component.getUserLastCus('999')).toBeUndefined();
    });
  });

  describe('shouldShowForm', () => {
    it('should return true when user is in form visibility set and has no last CUS', () => {
      component.usersWithFormVisible.add('1');
      expect(component.shouldShowForm('1')).toBeTrue();
    });

    it('should return false when user has last CUS', () => {
      component.usersWithFormVisible.add('1');
      component.userLastTransactionCus.set('1', {
        encrypted: 'ENC123',
        original: 'ORIG456',
      });
      expect(component.shouldShowForm('1')).toBeFalse();
    });

    it('should return false when user is not in form visibility set', () => {
      expect(component.shouldShowForm('1')).toBeFalse();
    });
  });

  describe('shouldShowNewTransactionButton', () => {
    it('should return true when user has last CUS and form is not visible', () => {
      component.userLastTransactionCus.set('1', {
        encrypted: 'ENC123',
        original: 'ORIG456',
      });
      expect(component.shouldShowNewTransactionButton('1')).toBeTrue();
    });

    it('should return false when user has no last CUS', () => {
      expect(component.shouldShowNewTransactionButton('1')).toBeFalse();
    });

    it('should return false when form is visible', () => {
      component.userLastTransactionCus.set('1', {
        encrypted: 'ENC123',
        original: 'ORIG456',
      });
      component.usersWithFormVisible.add('1');
      expect(component.shouldShowNewTransactionButton('1')).toBeFalse();
    });
  });

  describe('showToast', () => {
    it('should set toastMessage', () => {
      component.showToast('Test message');
      expect(component.toastMessage).toBe('Test message');
    });

    it('should clear toastMessage after 2 seconds', fakeAsync(() => {
      component.showToast('Test message');
      tick(2000);
      expect(component.toastMessage).toBeNull();
    }));
  });

  describe('trackByUserId', () => {
    it('should return user id', () => {
      const user = {
        id: '123',
        name: 'Test',
        email: 'test@test.com',
        city: 'Test',
        country: 'Test',
        phone: '123',
        picture: '',
      };
      expect(component.trackByUserId(0, user)).toBe('123');
    });
  });
});
