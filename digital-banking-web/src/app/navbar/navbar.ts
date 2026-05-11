import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // AJOUTER CET IMPORT

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink], // AJOUTER RouterLink ICI
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {}
