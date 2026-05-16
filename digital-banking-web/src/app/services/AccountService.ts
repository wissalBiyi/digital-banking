import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountDetails } from '../model/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  readonly backendHost: string = "http://localhost:8085";

  constructor(private http: HttpClient) { }

  // Récupérer les détails et l'historique d'un compte
  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(this.backendHost + `/accounts/${accountId}/pageOperations?page=${page}&size=${size}`);
  }

  // Effectuer un retrait (Débit)
  public debit(accountId: string, amount: number, description: string): Observable<any> {
    let data = { accountId: accountId, amount: amount, description: description };
    return this.http.post(this.backendHost + "/accounts/debit", data);
  }

  // Effectuer un versement (Crédit)
  public credit(accountId: string, amount: number, description: string): Observable<any> {
    let data = { accountId: accountId, amount: amount, description: description };
    return this.http.post(this.backendHost + "/accounts/credit", data);
  }

  // Effectuer un virement
  public transfer(accountSource: string, accountDestination: string, amount: number, description: string): Observable<any> {
    let data = { accountSource, accountDestination, amount, description };
    return this.http.post(this.backendHost + "/accounts/transfer", data);
  }
}
