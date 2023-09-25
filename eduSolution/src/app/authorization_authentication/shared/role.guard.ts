import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable ({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate{
  constructor(private service:LoginService, private route:Router){} 
  canActivate(){
    if(this.service.haveAccess()){
      return true;
    }
    this.route.navigate(['']);
    return false;
  }
};
