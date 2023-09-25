import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable ({
  providedIn: 'root'
})
export class GenreGuard implements CanActivate{
  currentRole:any;
  constructor(private service:LoginService, private route:Router){}
  canActivate(){
    if(this.service.getToken()!=''){
      this.currentRole = this.service.getRoleByToken(this.service.getToken());
      if(this.currentRole=='admin' || this.currentRole=='librarian'){
        return true;
      }
    }
    alert("Nie masz uprawnień by odwiedzić tę stronę");
    this.route.navigate([''])
    return false;
  }
};
