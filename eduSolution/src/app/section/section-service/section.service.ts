import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";


@Injectable()
export class SectionService {

  public API = '//localhost:9191';
  public SECTION_API = this.API + '/section-controller';
  public EDUMATERIAL_API = this.API + '/edu-material-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.SECTION_API + '/sections')
  }

  get(id: string) {
    return this.http.get(this.SECTION_API + '/section/' + id);
  }

  save (course: any) : Observable <any> {
    let result: Observable<Object>;
    if(course['href']){
      result = this.http.put(course.href, course)
    } else {
      result = this.http.post(this.SECTION_API + '/addSection', course)
    }
    return result;
  }


  updateEduMaterial(section: any){
    let result: Observable<Object>;
    result = this.http.put(this.SECTION_API + '/updateEduMaterial', section)
    return result;
  }
 

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.SECTION_API + '/deleteSection/' + id);
  }

  getSectionsByCourseId(classGroupId: string): Observable<any[]> {
    const url = `${this.SECTION_API}/sectionsByClassGroupId/${classGroupId}`;
    return this.http.get<any[]>(url);
  }

  eduMaterialsBySectionId(sectionId: string) {
    // const url = `${this.SECTION_API}/eduMaterialsBySectionId/${sectionId}`;
    return this.http.get(this.EDUMATERIAL_API + '/eduMaterialsBySectionId/' + sectionId);
    // return this.http.get<any[]>(url);
  }
  
}


