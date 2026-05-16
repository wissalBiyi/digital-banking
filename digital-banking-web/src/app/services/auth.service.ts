import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendHost: string = "http://localhost:8085";

  // États de l'authentification partagés dans l'application
  public isAuthenticated: boolean = false;
  public roles: string[] = [];
  public username: string | undefined;
  public accessToken: string | null = null;

  constructor(private http: HttpClient) {
    // Tenter de recharger la session si un token existe déjà
    this.loadToken();
  }

  // Connexion de l'utilisateur
  public login(username: string, password: string): Observable<LoginResponse> {
    // Le backend attend du x-www-form-urlencoded (@RequestParam)
    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post<LoginResponse>(`${this.backendHost}/auth/login`, body.toString(), options).pipe(
      tap(response => {
        this.saveToken(response['access-token']);
      })
    );
  }

  // Enregistrer le token et décoder le profil
  public saveToken(jwt: string) {
    this.isAuthenticated = true;
    this.accessToken = jwt;
    localStorage.setItem("access-token", jwt);
    this.decodeJWT();
  }

  // Décoder la charge utile (Payload) du JWT de manière native
  private decodeJWT() {
    if (this.accessToken) {
      const payload = this.accessToken.split('.')[1];
      const decodedJson = window.atob(payload);
      const decodedObj = JSON.parse(decodedJson);

      this.username = decodedObj.sub;
      // Spring Security injecte les rôles dans la propriété 'scope' séparés par un espace
      this.roles = decodedObj.scope.split(' ');
    }
  }

  // Charger le token depuis le stockage local (Persistance de la session)
  public loadToken() {
    const token = localStorage.getItem("access-token");
    if (token) {
      this.accessToken = token;
      this.isAuthenticated = true;
      this.decodeJWT();
    }
  }

  // Déconnexion
  public logout() {
    this.isAuthenticated = false;
    this.accessToken = null;
    this.username = undefined;
    this.roles = [];
    localStorage.removeItem("access-token");
  }

  // Permet de masquer/afficher des boutons dans l'interface (ex: Masquer "Save Operation" si pas admin)
  public isAdmin(): boolean {
    return this.roles.includes('SCOPE_ADMIN');
  }
}
