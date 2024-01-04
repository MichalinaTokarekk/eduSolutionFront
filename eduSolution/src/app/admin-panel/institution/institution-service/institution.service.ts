import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class InstitutionService {

  public API = '//localhost:9191';
  public INSTITUTION_API = this.API + '/institution-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.INSTITUTION_API + '/institutions')
  }

  get(id: string) {
    return this.http.get(this.INSTITUTION_API + '/institution/' + id);
  }

  save (institution: any) : Observable <any> {
    let result: Observable<Object>;
    if(institution['href']){
      result = this.http.put(institution.href, institution)
    } else {
      result = this.http.post(this.INSTITUTION_API + '/addInstitution', institution)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.INSTITUTION_API + '/deleteInstitution/' + id);
  }
}


