import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class GradeService {

  public API = '//localhost:9191';
  public GRADE_API = this.API + '/grade-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.GRADE_API + '/grades')
  }

  get(id: string) {
    return this.http.get(this.GRADE_API + '/grade/' + id);
  }

  getGradesByStudentId(studentId: number) {
    return this.http.get(this.GRADE_API + '/getGradesByStudentId/' + studentId);
  }

  save (grade: any) : Observable <any> {
    let result: Observable<Object>;
    if(grade['href']){
      result = this.http.put(grade.href, grade)
    } else {
      result = this.http.post(this.GRADE_API + '/addGrade', grade)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.GRADE_API + '/deleteGrade/' + id);
  }
}


