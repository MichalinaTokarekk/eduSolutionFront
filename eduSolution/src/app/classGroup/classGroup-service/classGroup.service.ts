import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { ClassGroup } from "src/app/interfaces/classGroup-interface";


@Injectable()
export class ClassGroupService {

  public API = '//localhost:9191';
  public CLASSGROUP_API = this.API + '/class-group-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.CLASSGROUP_API + '/groups')
  }

  get(id: string) {
    return this.http.get(this.CLASSGROUP_API + '/group/' + id);
  }

  save (course: any) : Observable <any> {
    let result: Observable<Object>;
    if(course['href']){
      result = this.http.put(course.href, course)
    } else {
      result = this.http.post(this.CLASSGROUP_API + '/addGroup', course)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.CLASSGROUP_API + '/deleteGroup/' + id);
  }

  findClassGroupsByCoursesId(courseId: string) {
    return this.http.get(this.CLASSGROUP_API + '/findClassGroupsByCourseId/' + courseId);
  }

  findClassGroupsByCourseAndUserId(courseId: number, userId: number) {
    return this.http.get<ClassGroup[]>(`${this.CLASSGROUP_API}/findClassGroupsByCourseAndUserId/${courseId}/${userId}`);
  }

  findByCourseId(courseId: number) {
    return this.http.get(this.CLASSGROUP_API + '/findByCourseId/' + courseId);
  }
}


