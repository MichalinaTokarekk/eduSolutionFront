import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class EventsScheduleService {

  public API = '//localhost:9191';
  public EVENT_API = this.API + '/event-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.EVENT_API + '/events')
  }

  get(id: string) {
    return this.http.get(this.EVENT_API + '/event/' + id);
  }

  save (lesson: any) : Observable <any> {
    let result: Observable<Object>;
    if(lesson['href']){
      result = this.http.put(lesson.href, lesson)
    } else {
      result = this.http.post(this.EVENT_API + '/addEvent', lesson)
    }
    return result;
  }

  update(lesson: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.put(this.EVENT_API + '/updateEvent', lesson);
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.EVENT_API + '/deleteEvent/' + id);
  }
}


