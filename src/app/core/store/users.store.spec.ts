import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsersStore } from './users.store';
import { UsersService } from '../services/users.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

const mockUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  city: 'New York',
  country: 'USA',
  phone: '123-456-7890',
  picture: 'thumbnail.jpg',
};

const mockUsers = [mockUser];

describe('UsersStore', () => {
  let store: UsersStore;
  let usersService: jasmine.SpyObj<UsersService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UsersService', ['getUsers']);

    TestBed.configureTestingModule({
      providers: [
        UsersStore,
        { provide: UsersService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    store = TestBed.inject(UsersStore);
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty users array', () => {
      expect(store.users()).toEqual([]);
    });

    it('should have loading as false', () => {
      expect(store.loading()).toBeFalse();
    });

    it('should have error as null', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('loadUsers', () => {
    it('should load users successfully with default limit', fakeAsync(() => {
      usersService.getUsers.and.returnValue(of(mockUsers));

      store.loadUsers();

      expect(store.loading()).toBeTrue();
      expect(usersService.getUsers).toHaveBeenCalledWith(60);

      tick();

      expect(store.users()).toEqual(mockUsers);
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBeNull();
    }));

    it('should load users successfully with custom limit', fakeAsync(() => {
      usersService.getUsers.and.returnValue(of(mockUsers));

      store.loadUsers(25);

      expect(store.loading()).toBeTrue();
      expect(usersService.getUsers).toHaveBeenCalledWith(25);

      tick();

      expect(store.users()).toEqual(mockUsers);
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBeNull();
    }));

    it('should handle error when loading users', fakeAsync(() => {
      usersService.getUsers.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      store.loadUsers();

      expect(store.loading()).toBeTrue();

      tick();

      expect(store.error()).toBe('Error cargando usuarios');
      expect(store.loading()).toBeFalse();
      expect(store.users()).toEqual([]);
    }));

    it('should reset error when loading again after error', fakeAsync(() => {
      usersService.getUsers.and.returnValue(
        throwError(() => new Error('API Error'))
      );
      store.loadUsers();
      tick();

      expect(store.error()).toBe('Error cargando usuarios');

      usersService.getUsers.and.returnValue(of(mockUsers));
      store.loadUsers();

      expect(store.error()).toBeNull();
      expect(store.loading()).toBeTrue();

      tick();

      expect(store.error()).toBeNull();
      expect(store.loading()).toBeFalse();
    }));

    it('should set loading to false after error', fakeAsync(() => {
      usersService.getUsers.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      store.loadUsers();
      expect(store.loading()).toBeTrue();

      tick();

      expect(store.loading()).toBeFalse();
    }));

    it('should replace users when loading multiple times', fakeAsync(() => {
      const firstUsers = [mockUser];
      const secondUsers = [{ ...mockUser, id: '456', name: 'Jane Doe' }];

      usersService.getUsers.and.returnValue(of(firstUsers));
      store.loadUsers();
      tick();

      expect(store.users()).toEqual(firstUsers);

      usersService.getUsers.and.returnValue(of(secondUsers));
      store.loadUsers();
      tick();

      expect(store.users()).toEqual(secondUsers);
      expect(store.users().length).toBe(1);
    }));
  });

  describe('computed properties', () => {
    it('should update computed users when state changes', fakeAsync(() => {
      usersService.getUsers.and.returnValue(of(mockUsers));

      let usersValue = store.users();
      expect(usersValue).toEqual([]);

      store.loadUsers();
      tick();

      usersValue = store.users();
      expect(usersValue).toEqual(mockUsers);
    }));

    it('should update computed loading when state changes', () => {
      usersService.getUsers.and.returnValue(of(mockUsers));

      expect(store.loading()).toBeFalse();

      store.loadUsers();
      expect(store.loading()).toBeTrue();
    });

    it('should update computed error when state changes', fakeAsync(() => {
      usersService.getUsers.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      expect(store.error()).toBeNull();

      store.loadUsers();
      tick();

      expect(store.error()).toBe('Error cargando usuarios');
    }));
  });
});
