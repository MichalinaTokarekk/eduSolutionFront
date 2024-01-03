import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class PaymentService {

  public API = '//localhost:9191';
  public STRIPEURL = this.API + '/payment-controller';

  constructor (private http: HttpClient){}

 public confirm(id: string): Observable<string> {
    return this.http.post<string>(this.STRIPEURL + '/confirm/', id)
 }

 
 public cancel(id: string): Observable<string> {
    return this.http.post<string>(this.STRIPEURL + '/cancel/', id)
 }

}


