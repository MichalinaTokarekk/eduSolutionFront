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
import { StudentDetailGradeComponent } from 'src/app/grade/grade-detail/studentDetailGrade.component';
import { UserService } from 'src/app/user/user-service/user.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';
import { catchError } from 'rxjs';
import { CertificateConfirmationService } from 'src/app/certificateConfirmation/certificateConfirmation-service/certificateConfirmation.service';

@Component({
  selector: 'courses-by-student',
  templateUrl: './classGroupsByStudent.component.html',
  styleUrls: ['./classGroupsByStudent.component.css']
})
export class ClassGroupsByStudentComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  certificate: any;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
                private loginService: LoginService, private gradeService: GradeService, private route: ActivatedRoute, private userService: UserService, 
                private classGroupService: ClassGroupService, private location: Location, private certificateConfirmationService: CertificateConfirmationService){

  }

  courseId!: number; // Dodaj courseId
  grades: any[] = [];
  ngOnInit(): void {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
    this.loadAllCourse();
  
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
    this.classGroupService.findClassGroupsByCourseAndUser(this.courseId, _finalData.id).subscribe((data: any) => {
      this.courseArray = data as any[];
      // this.filteredCourses = data as any[];
      console.log('courseArray:', this.courseArray);
      console.log('gradecFromCourse:', this.courseArray);
  
      if (this.courseArray && this.courseArray.length > 0) {
        this.courseArray.forEach((course) => {
          this.gradeService.findAllByStudentAndClassGroup(_finalData.id, course.id).subscribe(
            (gradesData) => {
              course.grades = gradesData;
              this.getCertificateConfirmation(course.id);
              console.log('classGroupId2', course.id);
              console.log('grades', course.grades);
            },
            (error: any) => {
              console.error('Błąd podczas pobierania ocen dla kursu', course.name, error);
            }
          );
        });
      }
    });
  }); 

  
  }

  selectedCourseName: string = '';
  selectedCourseDifficultyLevel: string = '';
  loadAllCourse() {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
    this.route.params.subscribe(params => {
        this.courseId = params['courseId'];
        this.classGroupService.findClassGroupsByCourseAndUser(this.courseId, _finalData.id).subscribe((res: any)=>{
            this.courseArray = res;
            this.filteredCourses= res;
            this.selectedCourseName = res.length > 0 ? res[0].course.name : '';
            this.selectedCourseDifficultyLevel = res.length > 0 ? res[0].course.difficultyLevel : '';
            console.log('filteredC', this.filteredCourses);
        })
    });
   
  }
  

  // obliczSredniaWazona(grades: Grade[]): number {
  //   let sumaOcen = 0.0;
  //   let sumaWag = 0.0;

  //   for (const ocena of grades) {
  //     if (!ocena.finalValue) {
  //       const wagaOceny: TypeOfTestingKnowledge = ocena.typeOfTestingKnowledge;
  //       if (wagaOceny) {
  //         sumaOcen += ocena.value * wagaOceny.weight;
  //         sumaWag += wagaOceny.weight;
  //       }
  //     }
  //   }

  //   if (sumaWag === 0.0) {
  //     return 0.0; // W przypadku braku ocen lub wag ocen
  //   } else {
  //     return sumaOcen / sumaWag;
  //   }
    
  // }

  obliczSredniaWazona(grades: Grade[]): number {
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return 0.0; // Brak ocen
    }
  
    let sumaOcen = 0.0;
    let sumaWag = 0.0;
  
    for (const ocena of grades) {
      if (ocena && !ocena.finalValue) {
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
  

  gradesByUser: { [key: number]: Grade[] } = {}; 
  teacher: any;

  loadGradesByStudentId(studentId: number, courseId: number) {
    console.log('Kliknięto przycisk Pobierz oceny.');
    this.gradeService.getGradesByStudentId(studentId, courseId).subscribe((grades) => {
       console.log('Oceny dla studentId ' + studentId + ':', grades);
       this.gradesByUser[studentId] = grades as Grade[];
       console.log('Przypisano do gradesByUser:', this.gradesByUser);
    });
 }
 
 

  openStudentDetailGradeDialog(courseId: number, courseName: string) {
    const userId = this.loginService.getUserId();
    if (userId !== null) {
    this.gradeService.findAllByStudentAndClassGroup(userId, courseId).subscribe((grades: any) => {
      const typesOfGrades = grades.map((grade: Grade) => grade.typeOfTestingKnowledge);
      const token = this.loginService.getToken();
      const _token = token.split('.')[1];
      const _atobData = atob(_token);
      const _finalData = JSON.parse(_atobData);
      const firstGrade = grades[0];

      if (firstGrade) {
      const teacherFirstName = firstGrade.teacher.firstName;
      const teacherLastName = firstGrade.teacher.lastName;

      const dialogRef = this.dialog.open(StudentDetailGradeComponent, {
        width: '510px',
        height: '500px',
        data: {
          grades,
          studentId: _finalData.id,
          courseId,
          courseName,
          teacherFirstName,
          teacherLastName,
          allTypes: typesOfGrades,
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'saved') {
          // Obsługa po zamknięciu dialogu
        }
      });

    } else {
      const dialogRef = this.dialog.open(StudentDetailGradeComponent, {
        width: '520px',
        height: '500px',
        data: {
          grades,
          studentId: _finalData.id,
          courseId,
          courseName,
          allTypes: typesOfGrades,
        },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'saved') {
          // Obsługa po zamknięciu dialogu
        }
      });
    }

    });
  }
  }


  selectedStatus: string | null = null;
  filterClassGroupsByStatus(status: string): void {
    this.selectedStatus = status;
  
    // Jeśli status to "Wszystkie", wyświetl wszystkie classGroups
    if (status === 'Wszystkie') {
      this.filteredCourses = this.courseArray;
    } else {
      // W przeciwnym razie, wybierz classGroups o wybranym statusie
      this.filteredCourses = this.courseArray.filter(
        (classGroup) => classGroup.classGroupStatus === status
      );
    }
  }


  goBack() {
    this.location.back();
  }


  getCertificateConfirmation(courseId: number) {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
  
    this.certificateConfirmationService.findCertificateConfirmationByUserIdAndClassGroupId(_finalData.id, courseId)
      .subscribe(
        (data) => {
          // Przypisz informacje o certyfikacie do odpowiedniego kursu
          const courseIndex = this.courseArray.findIndex(course => course.id === courseId);
          if (courseIndex !== -1) {
            this.courseArray[courseIndex].certificate = data;
            console.log('certificate', this.courseArray[courseIndex].certificate);
          }
        },
        (error) => {
          console.error('Error fetching certificate:', error);
        }
      );
  }
  
  
  
}
