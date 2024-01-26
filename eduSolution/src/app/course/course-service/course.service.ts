import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Course } from "src/app/interfaces/course-interface";


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

  findCoursesByUserId(userId: number) {
    return this.http.get(this.COURSE_API + '/findCoursesByUserId/' + userId);
  }

  // save (course: any) : Observable <any> {
  //   let result: Observable<Object>;
  //   if(course['href']){
  //     result = this.http.put(course.href, course)
  //   } else {
  //     result = this.http.post(this.COURSE_API + '/saveCourseWithImage', course)
  //   }
  //   return result;
  // }

  save(formData: FormData): Observable<any> {
    const result = this.http.post(this.COURSE_API + '/saveCourseWithImage', formData);
    return result;
}



updateCourse(formData: FormData): Observable<any> {
  console.log('formData:', formData);
  return this.http.put(this.COURSE_API + '/updateCourse', formData);
}






  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.COURSE_API + '/deleteCourse/' + id);
  }
}


