import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/course/course-service/course.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { UserService } from 'src/app/user/user-service/user.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-basic-inline-editing',
  templateUrl: './teachingClassGroups.component.html',
  styleUrls: ['./teachingClassGroups.component.css']
})
export class TeachingClassGroupsComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
                private loginService: LoginService, private userService: UserService, private route: ActivatedRoute, private classGroupService: ClassGroupService,
                private location: Location){

  }
  ngOnInit(): void {
    this.loadAllCourse();
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

  

  courseId!: number;
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
        })
    });
   
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

}
