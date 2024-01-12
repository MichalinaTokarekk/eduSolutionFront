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
import { Location } from '@angular/common';

@Component({
  selector: 'app-basic-inline-editing',
  templateUrl: './teachingCourses.component.html',
  styleUrls: ['./teachingCourses.component.css']
})
export class TeachingCoursesComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
                private loginService: LoginService, private userService: UserService, private location: Location){

  }
  ngOnInit(): void {
    this.loadAllCourse();
  }  

  uniqueCourseNames: string[] = []; 
  loadAllCourse() {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
    this.courseService.findCoursesByUserId(_finalData.id).subscribe((res: any)=>{
      this.courseArray = res;
      this.filteredCourses= res;
      const uniqueCourseNamesSet = new Set(this.courseArray.map((course) => course.name));
      this.uniqueCourseNames = Array.from(uniqueCourseNamesSet);
    })
  }

  goBack() {
    this.router.navigate(['/course-grid-view']);
  }


  selectedCourseName: string | null = null;
  filterClassGroupsByStatus(status: string): void {
    // console.log('Przed filtrowaniem:', this.courseArray);
    this.selectedCourseName = status;

    // Jeśli status to "Wszystkie", wyświetl wszystkie classGroups
    if (status === 'Wszystkie') {
      this.filteredCourses = this.courseArray;
    } else {
      // W przeciwnym razie, wybierz classGroups o wybranym statusie
      this.filteredCourses = this.courseArray.filter(
        (course) => course.name === status
      );
    }
    // console.log('Po filtrowaniu:', this.filteredCourses);
  }
  
}
