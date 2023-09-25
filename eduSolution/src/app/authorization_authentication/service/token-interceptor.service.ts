import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private inject:Injector) { }


  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   let authService=this.inject.get(AuthService);
  //   let authreq=this.addTokenHeader(request,authService.getToken());
  //   return next.handle(authreq).pipe(
  //     catchError(errordata=>{
  //       if(errordata.status===401){
  //         const expirationDate = authService.getTokenExpiration();
  //         const currentTime = Date.now();
  //         if (expirationDate && expirationDate <= currentTime) {
  //           // Token has expired, perform logout or other actions
  //           authService.logout();
  //         }
  //       }
  //       console.log(errordata);
  //       return throwError(errordata);
  //     })
  //   );
  // }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.inject.get(LoginService);
    
    const expirationDate = authService.getTokenExpiration();
    const currentTime = Date.now();
    
    if (expirationDate && expirationDate <= currentTime) {
      authService.logout();
      return throwError('Token expired');
    }
    
    let authreq = this.addTokenHeader(request, authService.getToken());
    
    return next.handle(authreq).pipe(
      catchError(errordata => {
        console.log(errordata);
        return throwError(errordata);
      })
    );
  }


  addTokenHeader(request: HttpRequest<any>, token:any){
    return request.clone({headers:request.headers.set('Authorization','Bearer ' + token)})
  }
}
