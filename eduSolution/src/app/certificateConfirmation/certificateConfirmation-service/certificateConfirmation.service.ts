import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { ClassGroup } from "src/app/interfaces/classGroup-interface";
import { CertificateConfirmation } from "src/app/interfaces/certificateConfirmation-interface";


@Injectable()
export class CertificateConfirmationService {

  public API = '//localhost:9191';
  public CERTIFICATIONCONFIRMATION_API = this.API + '/certificateConfirmation-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.CERTIFICATIONCONFIRMATION_API + '/certificateConfirmations')
  }

  get(id: string) {
    return this.http.get(this.CERTIFICATIONCONFIRMATION_API + '/certificateConfirmation/' + id);
  }

  save (course: any) : Observable <any> {
    let result: Observable<Object>;
    if(course['href']){
      result = this.http.put(course.href, course)
    } else {
      result = this.http.post(this.CERTIFICATIONCONFIRMATION_API + '/addCertificateConfirmation', course)
    }
    return result;
  }
  

  update(classGroup: any): Observable<any> {
    let result: Observable<Object>;
    result = this.http.put(this.CERTIFICATIONCONFIRMATION_API + '/updateCertificateConfirmation', classGroup);
    return result;
  }

  remove (id: number):Observable<string> {
    return this.http.delete<string>(this.CERTIFICATIONCONFIRMATION_API + '/deleteCertificateConfirmation/' + id);
  }

 

  findCertificateConfirmationByUserIdAndClassGroupId(userId: number, classGroupId: number) {
    return this.http.get<CertificateConfirmation[]>(`${this.CERTIFICATIONCONFIRMATION_API}/findCertificateConfirmationByUserIdAndClassGroupId/${userId}/${classGroupId}`);

  }
}


