import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user/user-service/user.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { CourseService } from 'src/app/course/course-service/course.service';

@Component({
  selector: 'app-basic-inline-editing',
  templateUrl: './offerPage.component.html',
  styleUrls: ['./offerPage.component.css']
})
export class OfferPageComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
    private userService: UserService, private loginService: LoginService){

  }
  ngOnInit(): void {
    this.loadAllCourse();
  }
  onNameSort() {
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

  loadAllCourse() {
    this.courseService.getAll().subscribe((res: any)=>{
      this.courseArray = res;
      this.filteredCourses= res;
    })
  }

    onCourseSelection(courseId: number) {
        // Przekazanie ID do SectionManage
        this.router.navigate(['/section-manage', courseId]);
    }
  

}
