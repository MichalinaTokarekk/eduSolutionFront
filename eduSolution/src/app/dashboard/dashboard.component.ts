import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../authorization_authentication/service/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    constructor(private router: Router, private loginService: LoginService) {}

    panelVisible = false;

    panelStyles: { [key: string]: string } = {};

    togglePanel() {
      this.panelVisible = !this.panelVisible;
      this.panelStyles = {
        left: this.panelVisible ? '0' : '-250px'
      };
    }

    actions(){
          if(this.loginService.getToken()!=''){
            let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
            if(_currentRole=='admin' || _currentRole=='teacher'){
              return true;
            }
          }
          return false
    }
}