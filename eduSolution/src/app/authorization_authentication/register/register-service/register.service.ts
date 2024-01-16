import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class RegisterService {
  

  public API = '//localhost:9191';
  public AUTH_API = this.API + '/auth';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.AUTH_API + '/user')
  }

  get(id: string) {
    return this.http.get(this.AUTH_API + '/user/' + id);
  }

  save (user: any) : Observable <any> {
    let result: Observable<Object>;
      result = this.http.post(this.AUTH_API + '/register', user)
    return result;
  }

  save2 (user: any) : Observable <any> {
    let result: Observable<Object>;
      result = this.http.post(this.AUTH_API + '/registerCreate', user)
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.AUTH_API + '/deleteUser/' + id);
  }
}


