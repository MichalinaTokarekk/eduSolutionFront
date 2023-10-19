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
            private gradeService: GradeService){}


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

loadGradesByStudentId(studentId: number) {
    console.log('Kliknięto przycisk Pobierz oceny.');
    this.gradeService.getGradesByStudentId(studentId).subscribe((grades) => {
        console.log('Oceny dla studentId ' + studentId + ':', grades);
        this.gradesByUser[studentId] = grades as Grade[];
    });
  }
  




}
