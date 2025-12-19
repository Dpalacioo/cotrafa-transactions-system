import { Routes } from '@angular/router';
import { TransactionsComponent } from './features/transactions/pages/transactions/transactions.component';
import { TransactionsHistoryComponent } from './features/transactions/components/transactions-history/transactions-history.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'transactions',
    pathMatch: 'full',
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
  },
  {
    path: 'history',
    component: TransactionsHistoryComponent,
  },
];
