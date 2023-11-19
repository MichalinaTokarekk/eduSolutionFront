import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Answer } from "src/app/interfaces/answer-interface";


@Injectable()
export class AnswerService {

  public API = '//localhost:9191';
  public ANSWER_API = this.API + '/answer-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.ANSWER_API + '/answers')
  }

  get(id: string) {
    return this.http.get(this.ANSWER_API + '/answer/' + id);
  }

  save (eduMaterial: any) : Observable <any> {
    let result: Observable<Object>;
    if(eduMaterial['href']){
      result = this.http.put(eduMaterial.href, eduMaterial)
    } else {
      result = this.http.post(this.ANSWER_API + '/addAnswer', eduMaterial)
    }
    return result;
  }

  updateAnswer(answer: any): Observable <any> {
    let result: Observable<Object>;
    result = this.http.put(this.ANSWER_API + '/updateAnswer', answer)
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.ANSWER_API + '/deleteAnswer/' + id);
  }

  answersByHomeworkTestId(homeworkTestId: string) {
    return this.http.get(this.ANSWER_API + '/answersByHomeworkTestId/' + homeworkTestId);
  }

  answersByUserId(userId: string) {
    return this.http.get(this.ANSWER_API + '/answersByUserId/' + userId);
  }
  
  getAnswerByHomeworkTestIdAndUserId(homeworkTestId: string, userId: number): Observable<Answer> {
    const url = `${this.ANSWER_API}/answerByHomeworkTestIdAndUserId/homeworkTest/${homeworkTestId}/user/${userId}`;
    return this.http.get<Answer>(url);
  }

  findByHomeworkTestAndClassGroup(homeworkTestId: number): Observable<Answer> {
    const url = `${this.ANSWER_API}/findByHomeworkTestAndClassGroup/homeworkTest/${homeworkTestId}/classGroup}`;
    return this.http.get<Answer>(url);
  }

  findByHomeworkTest(homeworkTestId: number): Observable<Answer> {
    const url = `${this.ANSWER_API}/findByHomeworkTest/${homeworkTestId}`;
    return this.http.get<Answer>(url);
  }

  
}


