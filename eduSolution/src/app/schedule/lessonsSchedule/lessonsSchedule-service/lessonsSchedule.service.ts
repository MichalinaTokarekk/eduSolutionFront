import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Lesson } from "src/app/interfaces/lesson-interface";


@Injectable()
export class LessonScheduleService {

  public API = '//localhost:9191';
  public LESSON_API = this.API + '/lesson-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.LESSON_API + '/lessons')
  }

  get(id: string) {
    return this.http.get(this.LESSON_API + '/lesson/' + id);
  }

  save (lesson: any) : Observable <any> {
    let result: Observable<Object>;
    if(lesson['href']){
      result = this.http.put(lesson.href, lesson)
    } else {
      result = this.http.post(this.LESSON_API + '/addLesson', lesson)
    }
    return result;
  }

  update(lesson: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.put(this.LESSON_API + '/updateLesson', lesson);
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.LESSON_API + '/deleteLesson/' + id);
  }

  findLessonsForUserInClassGroups(userId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.LESSON_API + '/findLessonsForUserInClassGroups/' + userId);
  }

  getAllWeekDays() {
    return this.http.get<Lesson[]>(this.LESSON_API + '/weekDays');
  }
  
}


