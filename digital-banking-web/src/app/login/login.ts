import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html', // <-- Assure-toi que ça pointe bien vers login.html
  styleUrl: './login.css'      // <-- Assure-toi que ça pointe bien vers login.css
})
export class LoginComponent implements OnInit {
  loginFormGroup!: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginFormGroup = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });
  }

  handleLogin() {
    let username = this.loginFormGroup.value.username;
    let password = this.loginFormGroup.value.password;

    this.authService.login(username, password).subscribe({
      next: (data) => {
        // Une fois connecté, on redirige vers l'espace comptes
        this.router.navigateByUrl("/accounts");
      },
      error: (err) => {
        this.errorMessage = "Username or Password incorrect";
        console.log(err);
      }
    });
  }
}
