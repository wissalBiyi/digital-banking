import { Routes } from '@angular/router';
import { Customers } from './customers/customers';
import { Accounts } from './accounts/accounts';
// 1. N'oublie pas d'importer le nouveau composant !
import { NewCustomer } from './new-customer/new-customer';

export const routes: Routes = [
  // Route pour la liste des clients
  { path: "customers", component: Customers },

  // Route pour les comptes
  { path: "accounts", component: Accounts },

  // 2. Route pour le formulaire de création
  { path: "new-customer", component: NewCustomer },

  // 3. Redirection par défaut (si l'URL est vide, on va sur customers)
  { path: "", redirectTo: "/customers", pathMatch: "full" }
];
