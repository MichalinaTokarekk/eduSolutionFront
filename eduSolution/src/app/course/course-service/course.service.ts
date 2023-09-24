import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class CourseService {

  public API = '//localhost:9191';
  public COURSE_API = this.API + '/course-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.COURSE_API + '/courses')
  }

  get(id: string) {
    return this.http.get(this.COURSE_API + '/course/' + id);
  }

  save (course: any) : Observable <any> {
    let result: Observable<Object>;
    if(course['href']){
      result = this.http.put(course.href, course)
    } else {
      result = this.http.post(this.COURSE_API + '/addCourse', course)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.COURSE_API + '/deleteCourse/' + id);
  }
}


