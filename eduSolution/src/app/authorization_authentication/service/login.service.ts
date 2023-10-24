import { AppComponent } from './../../app.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = 'http://localhost:9191/auth/authenticate';
  constructor(private http:HttpClient, private router:Router, private jwtHelperService: JwtHelperService) { 

  }
  tokenresp: any; 
  proceedLogin(userCred:any){
    return this.http.post(this.apiUrl,userCred)
  }

  isLoggedIn(){
    return localStorage.getItem('token')!=null;
  }

  getToken(){
    return localStorage.getItem('token')||'';
  }
  
  logout(){
    alert('Your session expired');
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  getRoleByToken(token: any){
    let _token = token.split('.')[1];
    this.tokenresp = JSON.parse(atob(_token));
    return this.tokenresp.role;
  }
  
  haveAccess(){
    var logginToken=localStorage.getItem('token')||'';
    var  _extractedToken=logginToken.split('.')[1];
    var  _atobData=atob(_extractedToken);
    var  _finalData=JSON.parse(_atobData);
    if(_finalData.role=='admin' || _finalData.role=='librarian'){
      return true;
    }
    alert('Nie masz uprawnień')
    return false;
  }

  getTokenExpiration() {
    const token = localStorage.getItem('token') || '';
    const tokenParts = token.split('.');
    
    if (tokenParts.length !== 3) {
      return null; // Token is not in valid format
    }
    
    const payload = tokenParts[1];
    
    try {
      const decodedPayload = JSON.parse(atob(payload));
      if (decodedPayload.exp) {
        return decodedPayload.exp * 1000; // Convert to milliseconds
      }
    } catch (error) {
      console.error('Error decoding token payload:', error);
    }
    
    return null;
  }


  getLoggedInUser() {
    const token = this.getToken();
  
    if (token) {
      const _token = token.split('.')[1];
      const _atobData = atob(_token);
      const _finalData = JSON.parse(_atobData);
  
      if (_finalData.id) {
        return _finalData.id; 
      }
    }
  
    return null; 
  }
  
  getUserId(): number | null {
    const token = localStorage.getItem('token'); // Załóżmy, że token JWT jest przechowywany w localStorage
    if (token) {
      const tokenPayload = this.jwtHelperService.decodeToken(token);
      return tokenPayload.id; // Zakładam, że ID użytkownika jest przechowywane w polu 'id' tokenu JWT
    }
    return null;
  }
  
  

}

