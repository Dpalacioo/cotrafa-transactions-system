import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionsRepository } from './transactions-repository.service';

describe('TransactionsRepository', () => {
  let service: TransactionsRepository;

  const mockTransaction = {
    id: '123',
    user: {
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      city: 'New York',
      country: 'USA',
      phone: '123-456-7890',
      picture: 'thumbnail.jpg',
    },
    amount: 50000,
    cus: {
      original: 'CUS-ORIGINAL',
      encrypted: 'CUS-ENCRYPTED',
    },
    createdAt: new Date('2024-01-01T10:00:00Z'),
  };

  const mockTransaction2 = {
    id: '456',
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      city: 'London',
      country: 'UK',
      phone: '987-654-3210',
      picture: 'thumbnail2.jpg',
    },
    amount: 75000,
    cus: {
      original: 'CUS-ORIGINAL-2',
      encrypted: 'CUS-ENCRYPTED-2',
    },
    createdAt: new Date('2024-01-02T10:00:00Z'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionsRepository);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have empty transactions initially when localStorage is empty', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const newService = new TransactionsRepository();
      expect(newService.transactions()).toEqual([]);
    });

    it('should load transactions from localStorage on initialization', () => {
      const storedTransactions = [mockTransaction];
      localStorage.setItem('transactions', JSON.stringify(storedTransactions));

      const newService = new TransactionsRepository();
      expect(newService.transactions().length).toBe(1);
      expect(newService.transactions()[0].id).toBe('123');
    });

    it('should parse dates correctly from localStorage', () => {
      const storedTransactions = [mockTransaction];
      localStorage.setItem('transactions', JSON.stringify(storedTransactions));

      const newService = new TransactionsRepository();
      const loadedTransaction = newService.transactions()[0];
      expect(loadedTransaction.createdAt).toEqual(jasmine.any(Date));
      expect(loadedTransaction.createdAt.toISOString()).toBe(
        '2024-01-01T10:00:00.000Z'
      );
    });
  });

  describe('save method', () => {
    it('should save transaction and add it to the beginning of the list', () => {
      service.save(mockTransaction);

      expect(service.transactions().length).toBe(1);
      expect(service.transactions()[0].id).toBe('123');
    });

    it('should save multiple transactions in correct order (newest first)', () => {
      service.save(mockTransaction);
      service.save(mockTransaction2);

      expect(service.transactions().length).toBe(2);
      expect(service.transactions()[0].id).toBe('456');
      expect(service.transactions()[1].id).toBe('123');
    });

    it('should persist transactions to localStorage', () => {
      service.save(mockTransaction);

      const stored = localStorage.getItem('transactions');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe('123');
    });

    it('should update signal when saving', () => {
      const initialValue = service.transactions();
      service.save(mockTransaction);
      const updatedValue = service.transactions();

      expect(initialValue).toEqual([]);
      expect(updatedValue.length).toBe(1);
      expect(updatedValue[0].id).toBe('123');
    });
  });

  describe('delete method', () => {
    beforeEach(() => {
      service.save(mockTransaction);
      service.save(mockTransaction2);
    });

    it('should delete transaction by id', () => {
      service.delete('123');

      expect(service.transactions().length).toBe(1);
      expect(service.transactions()[0].id).toBe('456');
    });

    it('should not delete anything if transaction id not found', () => {
      service.delete('non-existent-id');

      expect(service.transactions().length).toBe(2);
    });

    it('should persist deletion to localStorage', () => {
      service.delete('123');

      const stored = localStorage.getItem('transactions');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe('456');
    });

    it('should update signal when deleting', () => {
      const beforeDelete = service.transactions();
      expect(beforeDelete.length).toBe(2);

      service.delete('123');

      const afterDelete = service.transactions();
      expect(afterDelete.length).toBe(1);
      expect(afterDelete[0].id).toBe('456');
    });
  });

  describe('clear method', () => {
    beforeEach(() => {
      service.save(mockTransaction);
      service.save(mockTransaction2);
    });

    it('should clear all transactions', () => {
      service.clear();

      expect(service.transactions().length).toBe(0);
    });

    it('should persist empty array to localStorage', () => {
      service.clear();

      const stored = localStorage.getItem('transactions');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual([]);
    });

    it('should update signal when clearing', () => {
      const beforeClear = service.transactions();
      expect(beforeClear.length).toBe(2);

      service.clear();

      const afterClear = service.transactions();
      expect(afterClear).toEqual([]);
    });
  });

  describe('transactions signal', () => {
    it('should be readonly', () => {
      expect(() => {
        (service as any).transactions.set([mockTransaction]);
      }).toThrow();
    });

    it('should reflect state changes', () => {
      expect(service.transactions()).toEqual([]);

      service.save(mockTransaction);
      expect(service.transactions().length).toBe(1);

      service.save(mockTransaction2);
      expect(service.transactions().length).toBe(2);
      expect(service.transactions()[0].id).toBe('456');
      expect(service.transactions()[1].id).toBe('123');

      service.delete('123');
      expect(service.transactions().length).toBe(1);
      expect(service.transactions()[0].id).toBe('456');

      service.clear();
      expect(service.transactions()).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle malformed JSON in localStorage', () => {
      localStorage.setItem('transactions', 'invalid json');

      const newService = new TransactionsRepository();
      expect(newService.transactions()).toEqual([]);
    });

    it('should handle empty string in localStorage', () => {
      localStorage.setItem('transactions', '');

      const newService = new TransactionsRepository();
      expect(newService.transactions()).toEqual([]);
    });

    it('should handle transactions with invalid dates', () => {
      const invalidTransaction = {
        ...mockTransaction,
        createdAt: 'invalid-date',
      };
      localStorage.setItem(
        'transactions',
        JSON.stringify([invalidTransaction])
      );

      const newService = new TransactionsRepository();
      expect(newService.transactions()[0].createdAt).toEqual(jasmine.any(Date));
    });

    it('should handle save with duplicate id (should add duplicate)', () => {
      service.save(mockTransaction);
      service.save({ ...mockTransaction, amount: 99999 });

      expect(service.transactions().length).toBe(2);
      expect(service.transactions()[0].amount).toBe(99999);
      expect(service.transactions()[1].amount).toBe(50000);
    });

    it('should maintain transaction order after multiple operations', () => {
      service.save(mockTransaction);
      service.save(mockTransaction2);

      service.delete('456');

      const mockTransaction3 = { ...mockTransaction, id: '789', amount: 30000 };
      service.save(mockTransaction3);

      expect(service.transactions().length).toBe(2);
      expect(service.transactions()[0].id).toBe('789');
      expect(service.transactions()[1].id).toBe('123');
    });

    it('should handle many transactions', () => {
      const manyTransactions = Array.from({ length: 100 }, (_, i) => ({
        ...mockTransaction,
        id: `id-${i}`,
        amount: i * 1000,
      }));

      manyTransactions.forEach((tx) => service.save(tx));

      expect(service.transactions().length).toBe(100);
      expect(service.transactions()[0].id).toBe('id-99');
      expect(service.transactions()[99].id).toBe('id-0');
    });
  });

  describe('Data integrity', () => {
    it('should preserve all transaction properties when saving and loading', () => {
      const complexTransaction = {
        id: 'complex-123',
        user: {
          id: 'user-complex',
          name: 'Complex User',
          email: 'complex@example.com',
          city: 'Complex City',
          country: 'Complex Country',
          phone: '555-COMPLEX',
          picture: 'complex.jpg',
        },
        amount: 123456,
        cus: {
          original: 'ORIGINAL-COMPLEX',
          encrypted: 'ENCRYPTED-COMPLEX',
        },
        createdAt: new Date('2024-12-31T23:59:59.999Z'),
      };

      service.save(complexTransaction);

      const newService = new TransactionsRepository();
      const loaded = newService.transactions()[0];

      expect(loaded.id).toBe('complex-123');
      expect(loaded.user.name).toBe('Complex User');
      expect(loaded.user.email).toBe('complex@example.com');
      expect(loaded.user.city).toBe('Complex City');
      expect(loaded.user.country).toBe('Complex Country');
      expect(loaded.user.phone).toBe('555-COMPLEX');
      expect(loaded.user.picture).toBe('complex.jpg');
      expect(loaded.amount).toBe(123456);
      expect(loaded.cus.original).toBe('ORIGINAL-COMPLEX');
      expect(loaded.cus.encrypted).toBe('ENCRYPTED-COMPLEX');
      expect(loaded.createdAt.toISOString()).toBe('2024-12-31T23:59:59.999Z');
    });
  });

  describe('Performance', () => {
    it('should handle rapid successive operations', () => {
      for (let i = 0; i < 10; i++) {
        service.save({ ...mockTransaction, id: `id-${i}` });
      }

      expect(service.transactions().length).toBe(10);

      for (let i = 0; i < 5; i++) {
        service.delete(`id-${i}`);
      }

      expect(service.transactions().length).toBe(5);

      service.clear();
      expect(service.transactions().length).toBe(0);
    });
  });

  describe('Storage synchronization', () => {
    it('should reflect changes made directly to localStorage', fakeAsync(() => {
      service.save(mockTransaction);

      const stored = JSON.parse(localStorage.getItem('transactions')!);
      stored.push(mockTransaction2);
      localStorage.setItem('transactions', JSON.stringify(stored));

      const newService = new TransactionsRepository();
      expect(newService.transactions().length).toBe(2);
    }));
  });
});
