import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from '../../confirmations/semester/confirmation-dialog-semester.component';
import { Subscription, catchError, of, switchMap, tap } from 'rxjs';
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


/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'classGroupsByCourseAndUser.component.html',
  styleUrls: ['classGroupsByCourseAndUser.component.css'],
})
export class ClassGroupsByCourseAndUser implements OnInit {
course: any = {};
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
        this.courseService.get(id).subscribe((course: any) => {
          this.course = course;

          const token = this.loginService.getToken();
          const _token = token.split('.')[1];
          const _atobData = atob(_token);
          const _finalData = JSON.parse(_atobData);
          this.classGroupService.findClassGroupsByCourseAndUserId(course.id, _finalData.id).subscribe((classGroups: any) => {
            this.classGroups = classGroups;
          }, error => {
            console.error(error);
          });
          
        }, error => {
          console.error(error);
        });
      } else {
        console.log("Nie ma nic");
      }
    });
    // this.getTypeOfTestingKnowledge();
  }
  

  loadEduMaterialsBySectionId(classGroupId: number): void {
    this.userService.findUsersByClassGroupId(classGroupId).subscribe(users => {
      this.users = users;
    });
  }


//   loadGradesByStudentId(studentId: number) {
//     this.gradeService.getGradesByStudentId(studentId).subscribe(grades => {
//         this.grades = grades as any[];
//         console.log('oceny', grades);
//     });


//   }

gradesByUser: { [key: number]: Grade[] } = {}; 
teacher: any;

loadGradesByStudentId(studentId: number, courseId: number) {
    console.log('Kliknięto przycisk Pobierz oceny.');
    this.gradeService.getGradesByStudentId(studentId, courseId).subscribe((grades) => {
        console.log('Oceny dla studentId ' + studentId + ':', grades);
        this.gradesByUser[studentId] = grades as Grade[];
    });
}
  
  answerDetailComponent!: AddGradeDetailComponent;
  selectedStudent: User | undefined;

  openAddGradeDetailDialog(studentId: number, courseId: number, studentFirstName: string, studentLastName: string): void {
    const dialogRef = this.dialog.open(AddGradeDetailComponent, {
      width: '520px', // dostosuj szerokość do swoich potrzeb
      height: '250px',
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

//   openDetailEditGradeDialog(studentId: number, courseId: number, studentFirstName: string, studentLastName: string, teacherFirstName: string, teacherLastName: string): void {
//   const gradesForStudentInCourse = this.gradeService.getGradesByStudentId(studentId, courseId);

//     const dialogRef = this.dialog.open(DetailEditGradeComponent, {
//       width: '520px', 
//       height: '500px',
//       data: {  grades: this.gradeService.getGradesByStudentId(studentId, courseId), studentId, courseId, studentFirstName, studentLastName, teacherFirstName, teacherLastName, allTypes: this.allTypes}, 
//     });
  
//     dialogRef.afterClosed().subscribe(result => {
//       if (result === 'saved') {
//       }
//     });

//     console.log('types', this.allTypes)
//   }


openDetailEditGradeDialog(studentId: number, courseId: number, studentFirstName: string, studentLastName: string, teacherFirstName: string, teacherLastName: string): void {
    this.gradeService.getGradesByStudentId(studentId, courseId).subscribe((grades: any) => {
      const typesOfGrades = grades.map((grade: Grade) => grade.typeOfTestingKnowledge);
  
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
    });
  }
  
  
  



}
