import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../model/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {

  readonly backendHost: string = "http://localhost:8085";

  constructor(private http: HttpClient) { }

  // Liste tous les clients
  public getCustomers(): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(this.backendHost + "/customers");
  }

  // Recherche des clients par mot-clé
  public searchCustomers(keyword: string): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(this.backendHost + "/customers/search?keyword=" + keyword);
  }

  // MÉTHODE AJOUTÉE : Enregistre un nouveau client
  public saveCustomer(customer: Customer): Observable<Customer> {
    // On utilise la méthode POST pour envoyer les données au serveur
    return this.http.post<Customer>(this.backendHost + "/customers", customer);
  }
public deleteCustomer(id: number) {
    // On envoie une requête DELETE au serveur pour supprimer le client par son ID
    return this.http.delete(this.backendHost + "/customers/" + id);
  }
}
