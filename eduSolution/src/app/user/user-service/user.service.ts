import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable()
export class UserService {

  public API = '//localhost:9191';
  public USER_API = this.API + '/user-controller';
  public LIBRARYCARD_API = this.API + '/library-card-controller';
  public REGISTER_API = this.API + '/auth';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.USER_API + '/users')
  }

  get(id: string) {
    return this.http.get(this.USER_API + '/user/' + id);
  }

  save (user: any) : Observable <any> {
    let result: Observable<Object>;
    if(user['href']){
      result = this.http.put(user.href, user)
      
    } else {
      if(user.id!=null){
        result = this.http.put(this.USER_API + '/updateUser', user)

      }else
      result = this.http.post(this.REGISTER_API + '/register', user)
    }
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.USER_API + '/deleteUser/' + id);
  }


  getTeachingClassGroupsByUserId(userId: string): Observable<any> {
    return this.http.get<any>(this.USER_API + '/teachingClassGroups/' + userId);
  }

}


