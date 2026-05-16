import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'; // <-- AJOUT DE Router ICI
import { Navbar } from './navbar/navbar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service'; // <-- IMPORT DE TON SERVICE ICI

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      RouterOutlet,
      Navbar,
      HttpClientModule,
      ReactiveFormsModule
    ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('digital-banking-web');

  // Maintenant les types AuthService et Router sont reconnus !
  constructor(public authService: AuthService, private router: Router) {}

  handleLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
