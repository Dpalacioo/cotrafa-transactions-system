import { Injectable, signal, computed } from '@angular/core';
import { UsersService } from '../services/users.service';
import { User } from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class UsersStore {
  //  Estado interno
  private readonly _users = signal<User[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  //  Estado expuesto (solo lectura)
  readonly users = computed(() => this._users());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  constructor(private usersService: UsersService) {}

  //  Acción: cargar usuarios desde la API
  loadUsers(limit = 10): void {
    this._loading.set(true);
    this._error.set(null);

    this.usersService.getUsers(limit).subscribe({
      next: (users) => {
        this._users.set(users);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Error cargando usuarios');
        this._loading.set(false);
      },
    });
  }
}
