import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Customer } from '../model/customer.model';
import { CustomerService } from '../services/CustomerService';
import { Router } from '@angular/router'; // Pour la redirection

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-customer.html',
  styleUrl: './new-customer.css'
})
export class NewCustomer implements OnInit {

  newCustomerFormGroup! : FormGroup;

  // Ajout de customerService et router dans le constructeur
  constructor(private fb : FormBuilder,
              private customerService: CustomerService,
              private router: Router) { }

  ngOnInit(): void {
    this.newCustomerFormGroup = this.fb.group({
     name : this.fb.control(null, [Validators.required, Validators.minLength(4)]),

         // Email : Obligatoire + format email valide
         email : this.fb.control(null, [Validators.required, Validators.email])
    });
  }

  handleSaveCustomer() {
    // 1. On récupère les données du formulaire
    let customer: Customer = this.newCustomerFormGroup.value;

    // 2. On appelle le service pour enregistrer
    this.customerService.saveCustomer(customer).subscribe({
      next: data => {
        alert("Customer has been successfully saved!");
        // Optionnel : vider le formulaire ou rediriger
        // this.newCustomerFormGroup.reset();
        this.router.navigateByUrl("/customers");
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
