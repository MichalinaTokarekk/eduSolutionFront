import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class TypeOfTestingKnowledgeService {

  public API = '//localhost:9191';
  public TYPEOFTESTINGKNOWLEDgGE_API = this.API + '/typeOfTestingKnowledge-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.TYPEOFTESTINGKNOWLEDgGE_API + '/typesOfTestingKnowledge')
  }

  get(id: string) {
    return this.http.get(this.TYPEOFTESTINGKNOWLEDgGE_API + '/typeOfTestingKnowledge/' + id);
  }

  save (grade: any) : Observable <any> {
    let result: Observable<Object>;
    if(grade['href']){
      result = this.http.put(grade.href, grade)
    } else {
      result = this.http.post(this.TYPEOFTESTINGKNOWLEDgGE_API + '/addTypeOfTestingKnowledge', grade)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.TYPEOFTESTINGKNOWLEDgGE_API + '/deleteTypeOfTestingKnowledge/' + id);
  }
}


