import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class EduMaterialService {

  public API = '//localhost:9191';
  public EDUMATERIAL_API = this.API + '/edu-material-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.EDUMATERIAL_API + '/eduMaterials')
  }

  get(id: string) {
    return this.http.get(this.EDUMATERIAL_API + '/eduMaterial/' + id);
  }

  eduMaterialName(name: string) {
    return this.http.get(this.EDUMATERIAL_API + '/eduMaterialName/' + name);
  }

  save (eduMaterial: any) : Observable <any> {
    let result: Observable<Object>;
    if(eduMaterial['href']){
      result = this.http.put(eduMaterial.href, eduMaterial)
    } else {
      result = this.http.post(this.EDUMATERIAL_API + '/addEduMaterial', eduMaterial)
    }
    return result;
  }

  addSection(eduMaterial: any, sectionId: number) {
    const url = this.EDUMATERIAL_API +`/addSection?sectionId=${sectionId}`;
    return this.http.post(url, eduMaterial);
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.EDUMATERIAL_API + '/deleteEduMaterial/' + id);
  }
}


