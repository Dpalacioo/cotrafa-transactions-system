import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TransactionsHistoryComponent } from './transactions-history.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TransactionsRepository } from '../../../../core/repositories/transactions-repository.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../../shared/models/transaction.model';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('TransactionsHistoryComponent', () => {
  let component: TransactionsHistoryComponent;
  let fixture: ComponentFixture<TransactionsHistoryComponent>;
  let transactionsRepo: jasmine.SpyObj<TransactionsRepository>;
  let translateService: jasmine.SpyObj<TranslateService>;

  const mockTransaction: Transaction = {
    id: 'tx1',
    user: { id: 'u1', name: 'User 1' },
    cus: { original: 'CUS123', encrypted: 'ENC123' },
    amount: 5000,
    createdAt: new Date(),
  };

  const mockTransactionsSignal = signal<Transaction[]>([mockTransaction]);

  beforeEach(async () => {
    const repoSpy = jasmine.createSpyObj('TransactionsRepository', ['delete'], {
      transactions: mockTransactionsSignal,
    });

    const translateSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
      'get',
    ]);
    translateSpy.get.and.callFake((key: string) => of(key));
    translateSpy.instant.and.callFake((key: string) => key);

    await TestBed.configureTestingModule({
      imports: [
        TransactionsHistoryComponent, // Standalone
        TranslateModule.forRoot(),
        MatIconModule,
        CommonModule,
      ],
      providers: [
        { provide: TransactionsRepository, useValue: repoSpy },
        { provide: TranslateService, useValue: translateSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsHistoryComponent);
    component = fixture.componentInstance;
    transactionsRepo = TestBed.inject(
      TransactionsRepository
    ) as jasmine.SpyObj<TransactionsRepository>;
    translateService = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;

    mockTransactionsSignal.set([mockTransaction]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('copyCus', () => {
    it('should copy CUS to clipboard and show toast', fakeAsync(() => {
      const clipboardSpy = spyOn(
        navigator.clipboard,
        'writeText'
      ).and.returnValue(Promise.resolve());

      component.copyCus('TEST-CUS');

      expect(clipboardSpy).toHaveBeenCalledWith('TEST-CUS');
      expect(component.toastMessage).toBe('TRANSACTION_HISTORY.TOAST.COPIED');

      tick(2000);
      expect(component.toastMessage).toBeNull();
    }));
  });

  describe('Delete Logic', () => {
    it('should open delete modal and store ID', () => {
      component.openDeleteModal('tx123');
      expect(component.showDeleteModal).toBeTrue();
      expect(component.transactionToDelete).toBe('tx123');
    });

    it('should call delete on repo and emit event when confirmed', fakeAsync(() => {
      const emitSpy = spyOn(component.transactionsChanged, 'emit');
      component.transactionToDelete = 'tx1';

      component.confirmDelete();

      expect(transactionsRepo.delete).toHaveBeenCalledWith('tx1');
      tick();
      expect(emitSpy).toHaveBeenCalled();
      expect(component.showDeleteModal).toBeFalse();
      expect(component.transactionToDelete).toBeNull();
    }));

    it('should reset state when modal is closed', () => {
      component.showDeleteModal = true;
      component.transactionToDelete = 'tx1';

      component.closeModal();

      expect(component.showDeleteModal).toBeFalse();
      expect(component.transactionToDelete).toBeNull();
    });
  });

  describe('Signals Integration', () => {
    it('should get transactions from repository signal', () => {
      const results = component.transactions();
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('tx1');
    });

    it('should react when the signal updates', () => {
      mockTransactionsSignal.set([]);
      fixture.detectChanges();
      expect(component.transactions().length).toBe(0);
    });
  });

  describe('showToast', () => {
    it('should set and clear toastMessage', fakeAsync(() => {
      component.showToast('Hello');
      expect(component.toastMessage).toBe('Hello');
      tick(2000);
      expect(component.toastMessage).toBeNull();
    }));
  });
});
