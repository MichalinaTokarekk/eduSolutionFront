import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './authorization_authentication/service/login.service';
import { CartService } from './offer/cart/cart-service/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eduSolution';

  constructor(private route:Router, private loginService: LoginService, private cartService: CartService){

  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  actions(){
    if(this.loginService.getToken()!=''){
      let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
      if(_currentRole=='admin' ||  _currentRole=='teacher' || _currentRole=='user'){
        return true;
      }
    }
    return false
  }

actionsAdmin(){
  if(this.loginService.getToken()!=''){
    let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
    if(_currentRole=='admin'){
      return true;
    }
  }
  return false
}


actionsTeacher(){
  if(this.loginService.getToken()!=''){
    let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
    if(_currentRole=='admin' || _currentRole=='teacher'){
      return true;
    }
  }
  return false
}

actionsUser(){
  if(this.loginService.getToken()!=''){
    let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
    if(_currentRole=='admin' || _currentRole == 'user'){
      return true;
    }
  }
  return false
}

showDashboardLinks = false;
toggleDashboardLinks() {
  this.showDashboardLinks = !this.showDashboardLinks;
}

cartItemCount!: number;
cartItems: any[] = [];
ngOnInit(): void {
  const token = this.loginService.getToken();
  const _token = token.split('.')[1];
  const _atobData = atob(_token);
  const _finalData = JSON.parse(_atobData);
  this.cartService.countByUserId(_finalData.id).subscribe((count) => {
    this.cartItemCount = parseInt(count, 10); // lub parseFloat(count) dla liczb dziesiętnych
  });

  this.cartService.cartsByUserId(_finalData.id).subscribe(items => {
    this.cartItems = items as any[];

  });

  this.extractUserRole();
}

userRole!: string;
extractUserRole() {
  const token = this.loginService.getToken();
  
  if (token) {
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
    
    // Zakładając, że rola znajduje się w polu 'role' obiektu danych
    this.userRole = _finalData.role;
    console.log('role', this.userRole);
  }
}
}
