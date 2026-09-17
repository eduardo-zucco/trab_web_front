import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      this.router.navigate(['/login']);
    }

    return !!token;
  }

}
