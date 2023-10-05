import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class HTFileService {

  public API = '//localhost:9191';
  public HTFILE_API = this.API + '/htFile-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.HTFILE_API + '/htFiles')
  }

  get(id: string) {
    return this.http.get(this.HTFILE_API + '/htFile/' + id);
  }

  eduMaterialName(name: string) {
    return this.http.get(this.HTFILE_API + '/htFileeName/' + name);
  }

  save (eduMaterial: any) : Observable <any> {
    let result: Observable<Object>;
    if(eduMaterial['href']){
      result = this.http.put(eduMaterial.href, eduMaterial)
    } else {
      result = this.http.post(this.HTFILE_API + '/addHTFile', eduMaterial)
    }
    return result;
  }

  update (eduMaterial: any) : Observable <any> {
    let result: Observable<Object>;
      result = this.http.put(this.HTFILE_API + '/updateHTFile', eduMaterial)
    return result;
  }

//   uploadFile(file: File): Observable<any> {
//     const formData: FormData = new FormData();
//     formData.append('file', file, file.name);

//     return this.http.post(this.EMFILE_API + '/uploadFile', formData);
//   }


  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.HTFILE_API + '/deleteHTFile/' + id);
  }

  htFilesByHomeworkTestsId(eduMaterialId: string) {
    return this.http.get(this.HTFILE_API + '/htFilesByHomeworkTestId/' + eduMaterialId);
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
    const apiUrl = `${this.HTFILE_API}/${eduMaterialId}`;
  
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
  
    return this.http.get(`${this.HTFILE_API}/${fileId}`, { headers, responseType: 'blob' });
  }
  
}


