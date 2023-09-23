import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class SemesterService {

  public API = '//localhost:9191';
  public SEMESTER_API = this.API + '/semester-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.SEMESTER_API + '/semesters')
  }

  get(id: string) {
    return this.http.get(this.SEMESTER_API + '/semester/' + id);
  }

  save (semester: any) : Observable <any> {
    let result: Observable<Object>;
    if(semester['href']){
      result = this.http.put(semester.href, semester)
    } else {
      result = this.http.post(this.SEMESTER_API + '/addSemester', semester)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.SEMESTER_API + '/deleteSemester/' + id);
  }
}


