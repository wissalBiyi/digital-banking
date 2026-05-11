import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../services/CustomerService';
import { Customer } from '../model/customer.model';
import { Observable, catchError, throwError } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class Customers implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;
  searchFormGroup!: FormGroup;

  constructor(private customerService: CustomerService, private fb: FormBuilder) {}

  ngOnInit(): void {
    // 1. Initialisation du formulaire de recherche
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control("")
    });

    // 2. Chargement initial des données
    this.handleSearchCustomers();
  }

  // MÉTHODE : Rechercher des clients
  handleSearchCustomers() {
    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  // MÉTHODE : Supprimer un client
  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure?");
    if (!conf) return;

    this.customerService.deleteCustomer(c.id).subscribe({
      next: (resp) => {
        // On transforme l'observable actuel pour filtrer (retirer) le client supprimé
        this.customers = this.customers.pipe(
          map(data => {
            let index = data.indexOf(c);
            data.splice(index, 1); // Retire 1 élément à partir de l'index trouvé
            return data;
          })
        );
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // MÉTHODE : Récupérer tous les clients (optionnel si search("") est utilisé)
  handleGetCustomers() {
    this.customers = this.customerService.getCustomers().pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }
} // <--- Cette accolade ferme la classe Customers
