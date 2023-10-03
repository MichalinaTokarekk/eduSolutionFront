import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class EMFileService {

  public API = '//localhost:9191';
  public EMFILE_API = this.API + '/emFile-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.EMFILE_API + '/emFiles')
  }

  get(id: string) {
    return this.http.get(this.EMFILE_API + '/emFile/' + id);
  }

  eduMaterialName(name: string) {
    return this.http.get(this.EMFILE_API + '/emFileeName/' + name);
  }

  save (eduMaterial: any) : Observable <any> {
    let result: Observable<Object>;
    if(eduMaterial['href']){
      result = this.http.put(eduMaterial.href, eduMaterial)
    } else {
      result = this.http.post(this.EMFILE_API + '/addEMFile', eduMaterial)
    }
    return result;
  }

  update (eduMaterial: any) : Observable <any> {
    let result: Observable<Object>;
      result = this.http.put(this.EMFILE_API + '/updateEMFile', eduMaterial)
    return result;
  }

//   uploadFile(file: File): Observable<any> {
//     const formData: FormData = new FormData();
//     formData.append('file', file, file.name);

//     return this.http.post(this.EMFILE_API + '/uploadFile', formData);
//   }


  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.EMFILE_API + '/deleteEMFile/' + id);
  }

  emFilesByEduMaterialId(eduMaterialId: string) {
    return this.http.get(this.EMFILE_API + '/emFilesByEduMaterialId/' + eduMaterialId);
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
    const apiUrl = `${this.EMFILE_API}/${eduMaterialId}`;
  
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
  
    return this.http.get(`${this.EMFILE_API}/${fileId}`, { headers, responseType: 'blob' });
  }
  
}


