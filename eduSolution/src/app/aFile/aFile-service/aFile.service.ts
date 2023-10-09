import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class AFileService {

  public API = '//localhost:9191';
  public AFILE_API = this.API + '/aFile-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.AFILE_API + '/aFiles')
  }

  get(id: string) {
    return this.http.get(this.AFILE_API + '/aFile/' + id);
  }

  eduMaterialName(name: string) {
    return this.http.get(this.AFILE_API + '/aFileeName/' + name);
  }

  save (answer: any) : Observable <any> {
    let result: Observable<Object>;
    if(answer['href']){
      result = this.http.put(answer.href, answer)
    } else {
      result = this.http.post(this.AFILE_API + '/addAFile', answer)
    }
    return result;
  }

  update (answer: any) : Observable <any> {
    let result: Observable<Object>;
      result = this.http.put(this.AFILE_API + '/updateAFile', answer)
    return result;
  }

//   uploadFile(file: File): Observable<any> {
//     const formData: FormData = new FormData();
//     formData.append('file', file, file.name);

//     return this.http.post(this.EMFILE_API + '/uploadFile', formData);
//   }


  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.AFILE_API + '/deleteAFile/' + id);
  }

  aFilesByAnswerId(answerId: string) {
    return this.http.get(this.AFILE_API + '/aFilesByAnswerId/' + answerId);
  }


  uploadFile(file: File, eduMaterialId: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    // Dodaj odpowiednie nagłówki, w tym nagłówek do obsługi przesyłania danych jako formularza
    const headers = new HttpHeaders();
  
    // Ustaw nagłówek 'Accept' na 'application/json'
    headers.append('Accept', 'application/json');
  
    // Ustaw nagłówek 'Authorization' lub inne, jeśli to konieczne
  
    // Zmień endpoint URL na wyglądający podobnie do Postmana
    const apiUrl = `${this.AFILE_API}/${eduMaterialId}`;
  
    return this.http.post<string>(apiUrl, formData, { headers });
  }

//   downloadFile(fileName: string): Observable<Blob> {
//     const headers = new HttpHeaders({
//       'Accept': 'application/octet-stream', // Ustawić odpowiednie nagłówki dla pliku binarnego
//     });

//     return this.http.get(`${this.EMFILE_API}/${fileName}`, { headers, responseType: 'blob' });
//   }

downloadFileById(fileId: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/octet-stream', // Ustawić odpowiednie nagłówki dla pliku binarnego
    });
  
    return this.http.get(`${this.AFILE_API}/${fileId}`, { headers, responseType: 'blob' });
  }
  
}


