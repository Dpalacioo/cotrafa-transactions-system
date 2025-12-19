import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { UsersStore } from '../../../../core/store/users.store';
import { CusEncryptionService } from '../../../../core/services/cus-encryption.service';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;
  let mockUsersStore: any;
  let mockCusService: any;
  let mockTransactionsRepo: any;

  beforeEach(async () => {
    // Mock de UsersStore con métodos que el HTML espera
    mockUsersStore = {
      loading: jasmine.createSpy('loading').and.returnValue(false),
      users: jasmine.createSpy('users').and.returnValue([
        { id: '1', name: 'User 1' },
        { id: '2', name: 'User 2' },
      ]),
      error: jasmine.createSpy('error').and.returnValue(null),
      loadUsers: jasmine.createSpy('loadUsers'),
    };

    mockCusService = {
      generateCus: jasmine.createSpy('generateCus').and.returnValue('CUS123'),
      encrypt: jasmine.createSpy('encrypt').and.returnValue('ENCRYPTEDCUS123'),
    };

    mockTransactionsRepo = {
      save: jasmine.createSpy('save'),
    };

    await TestBed.configureTestingModule({
      imports: [TransactionsComponent],
      providers: [
        { provide: UsersStore, useValue: mockUsersStore },
        { provide: CusEncryptionService, useValue: mockCusService },
        { provide: TransactionsRepository, useValue: mockTransactionsRepo },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignora componentes hijos como <app-user-selector>
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUsers on init', () => {
    expect(mockUsersStore.loadUsers).toHaveBeenCalled();
  });

  it('should return the list of users from store', () => {
    const users = component.usersStore.users();
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('User 1');
  });

  it('should handle transaction submission from selector', () => {
    component.onTransactionSubmitFromSelector({ amount: 100, userId: '1' });
    expect(mockCusService.generateCus).toHaveBeenCalledWith('1');
    expect(mockCusService.encrypt).toHaveBeenCalledWith('CUS123');
    expect(mockTransactionsRepo.save).toHaveBeenCalledWith({
      userId: '1',
      amount: 100,
      cus: 'ENCRYPTEDCUS123',
    });
  });

  it('should update hasTransactions signal when checking for transactions', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify([{ userId: '1', amount: 100 }])
    );
    component.checkForTransactions();
    expect(component.hasTransactions()).toBeTrue();
  });

  it('should set hasTransactions to false if no transactions in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.checkForTransactions();
    expect(component.hasTransactions()).toBeFalse();
  });
});
