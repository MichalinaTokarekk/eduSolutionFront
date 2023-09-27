import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course-service/course.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-basic-inline-editing',
  templateUrl: './course-grid-view.component.html',
  styleUrls: ['./course-grid-view.component.css']
})
export class CourseGridViewComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar){

  }
  ngOnInit(): void {
    this.loadList();
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

  loadList() {
    this.courseService.getAll().subscribe (data => {
      this.courseArray = data;
      this.filteredCourses = data

    })
  }

  // W CourseGridViewComponent
    onCourseSelection(courseId: number) {
        // Przekazanie ID do SectionManage
        this.router.navigate(['/section-manage', courseId]);
  }
  

}
