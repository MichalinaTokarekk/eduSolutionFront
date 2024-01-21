// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private router: Router) {}

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean {
      const rolesRequired = (route.data as any)?.roles as string[];
  
      if (rolesRequired && rolesRequired.length > 0) {
        // Sprawdź, czy użytkownik ma wymagane role
        const hasRequiredRoles = rolesRequired.some(role => this.loginService.hasRole(role));
  
        if (!hasRequiredRoles) {
          // Użytkownik nie ma wymaganych ról - przekieruj go do odpowiedniego miejsca (np. strona logowania)
          this.router.navigate(['/login']);
          return false;
        }
      }
  
      // Użytkownik ma wymagane role lub ścieżka nie wymaga ról - pozwól na nawigację
      return true;
    }
}
