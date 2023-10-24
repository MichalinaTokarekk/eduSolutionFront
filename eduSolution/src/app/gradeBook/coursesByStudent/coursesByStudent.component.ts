import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/course/course-service/course.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { GradeService } from 'src/app/grade/grade-service/grade.service';
import { Grade } from 'src/app/interfaces/grade-interface';
import { TypeOfTestingKnowledge } from 'src/app/interfaces/typeOfTestingKnowledge-interface';

@Component({
  selector: 'courses-by-student',
  templateUrl: './coursesByStudent.component.html',
  styleUrls: ['./coursesByStudent.component.css']
})
export class CoursesByStudentComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
                private loginService: LoginService, private gradeService: GradeService, private route: ActivatedRoute){

  }

  courseId!: number; // Dodaj courseId
  grades: any[] = [];
  ngOnInit(): void {
    this.loadList();
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
  
    console.log('courseArray:', this.courseArray);
  
    this.courseService.findCoursesByStudentId(_finalData.id).subscribe((data: any) => {
      this.courseArray = data as any[];
      this.filteredCourses = data as any[];
  
      if (this.courseArray && this.courseArray.length > 0) {
        this.courseArray.forEach((course) => {
          this.gradeService.findAllByStudentAndCourse(_finalData.id, course.id).subscribe(
            (gradesData: any) => {
              // Przypisz oceny do kursu
              course.grades = gradesData;
            },
            (error: any) => {
              console.error('Błąd podczas pobierania ocen dla kursu', course.name, error);
            }
          );
        });
      }
    });
  }
  
  onNameSort() {
    // const filteredData =  this.filteredCourses.sort((a: any, b: any) =>
    // a.name.localeCompare(b.name));
    // this.filteredCourses = filteredData;

    const sortedData = this.filteredCourses.sort((a: any, b: any) => {
      if (this.ascendingSort) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name); // Sortowanie malejąco
      }
    });
    this.filteredCourses = sortedData;
    this.ascendingSort = !this.ascendingSort; // Zmień kierunek sortowania
  }



  onLpSort() {
    // Filtruj dane, aby pominięte były undefined wartości
    const filteredAndParsedData = this.filteredCourses
      .filter((course: any) => course.srNo !== undefined)
      .map((course: any) => ({
        ...course,
        srNo: Number(course.srNo)
      }));
  
    const sortedData = filteredAndParsedData.sort((a: any, b: any) => {
      if (this.ascendingSort) {
        return a.srNo - b.srNo; // Sortowanie rosnące liczb
      } else {
        return b.srNo - a.srNo; // Sortowanie malejąco liczb
      }
    });
  
    this.filteredCourses = sortedData;
    this.ascendingSort = !this.ascendingSort;
  }
  
  
  

  filter(event: any) {
    this.filteredCourses = this.courseArray.filter((searchData:any) => {
      let search = event;
      let values = Object.values(searchData);
      let flag = false
      values.forEach((val: any) => {
        if (val.toString().toLowerCase().indexOf(search) > -1) {
          flag = true;
          return;
        }
      })
      if (flag) {
        return searchData
      }
    });
  }

  

  loadList() {
    const token = this.loginService.getToken();
        const _token = token.split('.')[1];
        const _atobData = atob(_token);
        const _finalData = JSON.parse(_atobData);
    this.courseService.findCoursesByStudentId(_finalData.id).subscribe (data => {
        this.courseArray = data as any[];
        this.filteredCourses = data as any[];

    })
  }


  obliczSredniaWazona(grades: Grade[]): number {
    let sumaOcen = 0.0;
    let sumaWag = 0.0;

    for (const ocena of grades) {
      if (!ocena.finalValue) {
        const wagaOceny: TypeOfTestingKnowledge = ocena.typeOfTestingKnowledge;
        if (wagaOceny) {
          sumaOcen += ocena.value * wagaOceny.weight;
          sumaWag += wagaOceny.weight;
        }
      }
    }

    if (sumaWag === 0.0) {
      return 0.0; // W przypadku braku ocen lub wag ocen
    } else {
      return sumaOcen / sumaWag;
    }
    
  }

}
