import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/course/course-service/course.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { UserService } from 'src/app/user/user-service/user.service';

@Component({
  selector: 'app-courseByStudent-view',
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
                private loginService: LoginService, private userService: UserService){

  }
  ngOnInit(): void {
    this.loadAllCourse();
  }  

  loadAllCourse() {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
    this.courseService.findCoursesByUserId(_finalData.id).subscribe((res: any)=>{
      this.courseArray = res;
      this.filteredCourses= res;
    })
  }



}
