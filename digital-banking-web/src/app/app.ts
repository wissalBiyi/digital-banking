import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'; // <--- IMPORTATION MANQUANTE ICI

@Component({
  selector: 'app-root',
  standalone: true, // Assure-toi que c'est bien présent pour un composant moderne
  imports: [
      RouterOutlet,
      Navbar,
      HttpClientModule,
      ReactiveFormsModule // <--- Déclaré ici pour être utilisé dans les formulaires
    ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('digital-banking-web');
}
