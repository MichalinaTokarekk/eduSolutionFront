import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from '../../confirmations/semester/confirmation-dialog-semester.component';
import { Subscription, catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { UserService } from 'src/app/user/user-service/user.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { GradeService } from 'src/app/grade/grade-service/grade.service';
import { Grade } from 'src/app/interfaces/grade-interface';
import { AddGradeDetailComponent } from 'src/app/grade/grade-detail/add-Grade-detail.component';
import { User } from 'src/app/interfaces/user-interface';
import { DetailEditGradeComponent } from 'src/app/grade/grade-detail/detailEditGrade.component';
import { TypeOfTestingKnowledge } from 'src/app/interfaces/typeOfTestingKnowledge-interface';
import { AddFinalGradeDetailComponent } from 'src/app/grade/grade-detail/addFinalGrade.component';
import { Course } from 'src/app/interfaces/course-interface';
import { ClassGroup } from 'src/app/interfaces/classGroup-interface';


/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'classGroupsByCourseAndUser.component.html',
  styleUrls: ['classGroupsByCourseAndUser.component.css'],
})
export class ClassGroupsByCourseAndUser implements OnInit {
classGroup: any = {};
classGroups!: any[]; 
users!: any[]; 
grades!: any[]; 

constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, 
            private classGroupService: ClassGroupService, private loginService: LoginService, private userService: UserService, private courseService: CourseService,
            private gradeService: GradeService){
                this.grades = []; 

                
            }


ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id !== null) {
        this.classGroupService.get(id).subscribe((classGroup: any) => {
          this.classGroup = classGroup;

          const token = this.loginService.getToken();
          const _token = token.split('.')[1];
          const _atobData = atob(_token);
          const _finalData = JSON.parse(_atobData);   
          
          this.loadEduMaterialsBySectionId();

          
        }, error => {
          console.error(error);
        });
      } else {
        console.log("Nie ma nic");
      }
    });
    // this.getTypeOfTestingKnowledge();
    
    
  }
  

loadEduMaterialsBySectionId(): void {
  this.userService.findUsersByClassGroupId(this.classGroup.id).subscribe(users => {
    this.users = users;

    this.loadGradesByStudentId(this.classGroup.id);
  });
  console.log('classGroup', this.classGroup.id);
}

gradesByUser: { [key: number]: Grade[] } = {}; 
teacher: any;
selectedCourse!: ClassGroup;


loadGradesByStudentId(courseId: number) {
  this.users.forEach(user => {
    this.gradeService.findAllByStudentAndClassGroup(user.id, courseId).subscribe((grades) => {
        console.log('Oceny dla studentId ' + user.id + ':', grades);

        if (Array.isArray(grades)) {

            this.gradesByUser[user.id] = grades;
        } else {
            console.error('grades nie jest tablicą.');
        }
    });

})
}

mapGradesToString(grades: Grade[]): string {
  return grades.map(grade => grade.value.toString()).join(', ');
}








  
  answerDetailComponent!: AddGradeDetailComponent;
  selectedStudent: User | undefined;

  openAddGradeDetailDialog(studentId: number, courseId: number, studentFirstName: string, studentLastName: string): void {
    const dialogRef = this.dialog.open(AddGradeDetailComponent, {
      width: '510px', // dostosuj szerokość do swoich potrzeb
      height: '349px',
      data: { studentId, courseId, studentFirstName, studentLastName, }, // przekaż odpowiedź jako dane
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        // this.answerDetailComponent.updateAnswerDetails();
      }
    });
  }

  allTypes: TypeOfTestingKnowledge[] = [];
  getTypeOfTestingKnowledge() {
    this.allTypes = this.grades.map((grade) => grade.typeOfTestingKnowledge);
    console.log('Pobrane typy ocen:', this.allTypes);
  }


openDetailEditGradeDialog(studentId: number, courseId: number, studentFirstName: string, studentLastName: string): void {
    this.gradeService.findAllByStudentAndClassGroup(studentId, courseId).subscribe((grades: any) => {
      const typesOfGrades = grades.map((grade: Grade) => grade.typeOfTestingKnowledge);
      const firstGrade = grades[0];
  
      if (firstGrade) {
      const teacherFirstName = firstGrade.teacher.firstName;
      const teacherLastName = firstGrade.teacher.lastName;
      const dialogRef = this.dialog.open(DetailEditGradeComponent, {
        width: '520px',
        height: '500px',
        data: {
          grades,
          studentId,
          courseId,
          studentFirstName,
          studentLastName,
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
      const dialogRef = this.dialog.open(DetailEditGradeComponent, {
        width: '520px',
        height: '500px',
        data: {
          grades,
          studentId,
          courseId,
          studentFirstName,
          studentLastName,
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
  
  
  
  openAddFinalGradeDetailDialog(studentId: number, courseId: number, studentFirstName: string, studentLastName: string): void {
    const dialogRef = this.dialog.open(AddFinalGradeDetailComponent, {
      width: '450px', // dostosuj szerokość do swoich potrzeb
      height: '160px',
      data: { studentId, courseId, studentFirstName, studentLastName, }, // przekaż odpowiedź jako dane
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        // this.answerDetailComponent.updateAnswerDetails();
      }
    });
  }

  isFinalGradeAvailable(user: any): boolean {
    if (this.gradesByUser[user.id]) {
      for (const grade of this.gradesByUser[user.id]) {
        if (grade.finalValue == true) {
          return true;
        }
      }
    }
    return false; 
  }
  

  obliczSredniaWazona(oceny: Grade[]): number {
    let sumaOcen = 0.0;
    let sumaWag = 0.0;

    for (const ocena of oceny) {
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
