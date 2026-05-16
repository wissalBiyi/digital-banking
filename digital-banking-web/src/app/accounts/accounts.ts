import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../services/AccountService';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountDetails } from '../model/account.model';
import { AuthService } from '../services/auth.service'; // <-- 1. AJOUTE CET IMPORT

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class Accounts implements OnInit {
  accountFormGroup!: FormGroup;
  operationFormGroup!: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;
  accountDetails$!: Observable<AccountDetails>;
  errorMessage!: string;

  // <-- 2. MODIFICATION ICI : On ajoute "public authService: AuthService"
  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control('', [Validators.required])
    });

    this.operationFormGroup = this.fb.group({
      operationType: this.fb.control('CREDIT'),
      amount: this.fb.control(0, [Validators.required, Validators.min(1)]),
      description: this.fb.control(''),
      accountDestination: this.fb.control('')
    });
  }

  handleSearchAccount() {
    let accountId = this.accountFormGroup.value.accountId;
    this.accountDetails$ = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId = this.accountFormGroup.value.accountId;
    let operationType = this.operationFormGroup.value.operationType;
    let amount = this.operationFormGroup.value.amount;
    let description = this.operationFormGroup.value.description;
    let accountDestination = this.operationFormGroup.value.accountDestination;

    if (operationType === 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: () => {
          alert("Success Credit");
          this.operationFormGroup.reset({operationType: 'CREDIT', amount: 0});
          this.handleSearchAccount();
        },
        error: (err: any) => console.log(err)
      });
    } else if (operationType === 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: () => {
          alert("Success Debit");
          this.operationFormGroup.reset({operationType: 'DEBIT', amount: 0});
          this.handleSearchAccount();
        },
        error: (err: any) => console.log(err)
      });
    } else if (operationType === 'TRANSFER') {
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: () => {
          alert("Success Transfer");
          this.operationFormGroup.reset({operationType: 'TRANSFER', amount: 0});
          this.handleSearchAccount();
        },
        error: (err: any) => console.log(err)
      });
    }
  }
}
