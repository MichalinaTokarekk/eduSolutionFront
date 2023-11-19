import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './authorization_authentication/service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eduSolution';

  constructor(private route:Router, private loginService: LoginService){

  }

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }

  actions(){
    if(this.loginService.getToken()!=''){
      let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
      if(_currentRole=='admin' || _currentRole=='student' || _currentRole=='teacher' || _currentRole=='user'){
        return true;
      }
    }
    return false
}
}
