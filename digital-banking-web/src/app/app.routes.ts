import { Routes } from '@angular/router';
import { Customers } from './customers/customers';
import { Accounts } from './accounts/accounts';
import { NewCustomer } from './new-customer/new-customer';
import { LoginComponent } from './login/login';

export const routes: Routes = [
  // 1. Route pour la page de Login (Ajoutée ici !)
  { path: "login", component: LoginComponent },

  { path: "customers", component: Customers },
  { path: "accounts", component: Accounts },
  { path: "new-customer", component: NewCustomer },

  // 2. UNE SEULE redirection par défaut vers le login
  { path: "", redirectTo: "/login", pathMatch: "full" }
];
