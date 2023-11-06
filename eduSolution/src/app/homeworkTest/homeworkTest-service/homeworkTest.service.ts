import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class HomeworkTestService {

  public API = '//localhost:9191';
  public HOMEWORKTEST_API = this.API + '/homeworkTest-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.HOMEWORKTEST_API + '/homeworkTests')
  }

  get(id: string) {
    return this.http.get(this.HOMEWORKTEST_API + '/homeworkTest/' + id);
  }

  save (eduMaterial: any) : Observable <any> {
    let result: Observable<Object>;
    if(eduMaterial['href']){
      result = this.http.put(eduMaterial.href, eduMaterial)
    } else {
      result = this.http.post(this.HOMEWORKTEST_API + '/addHomeworkTest', eduMaterial)
    }
    return result;
  }

  update(homeworkTest: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.put(this.HOMEWORKTEST_API + '/updateHomeworkTest', homeworkTest);
    return result;
  }

  addSection(eduMaterial: any, sectionId: number) {
    const url = this.HOMEWORKTEST_API +`/addSection?sectionId=${sectionId}`;
    return this.http.post(url, eduMaterial);
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.HOMEWORKTEST_API + '/deleteHomeworkTest/' + id);
  }

  homeworkTestsBySectionId(sectionId: string) {
    return this.http.get(this.HOMEWORKTEST_API + '/homeworkTestsBySectionId/' + sectionId);
  }
}


