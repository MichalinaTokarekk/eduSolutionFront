import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class SectionService {

  public API = '//localhost:9191';
  public SECTION_API = this.API + '/section-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.SECTION_API + '/sections')
  }

  get(id: string) {
    return this.http.get(this.SECTION_API + '/section/' + id);
  }

  save (course: any) : Observable <any> {
    let result: Observable<Object>;
    if(course['href']){
      result = this.http.put(course.href, course)
    } else {
      result = this.http.post(this.SECTION_API + '/addSection', course)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.SECTION_API + '/deleteSection/' + id);
  }
}


