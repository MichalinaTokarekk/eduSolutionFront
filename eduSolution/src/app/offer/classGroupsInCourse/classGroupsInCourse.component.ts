import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user/user-service/user.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';

@Component({
  selector: 'app-classGroupsInCourse',
  templateUrl: './classGroupsInCourse.component.html',
  styleUrls: ['./classGroupsInCourse.component.css']
})
export class ClassGroupsInCourseComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private route: ActivatedRoute, private classGroupService: ClassGroupService){

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

  courseId!: number;
  selectedCourseName: string = '';
  selectedCourseDescription: string = '';
  loadAllCourse() {
    this.route.params.subscribe(params => {
        this.courseId = params['courseId'];
        this.classGroupService.findByCourseId(this.courseId).subscribe((res: any)=>{
            this.courseArray = res;
            this.filteredCourses= res;
            this.selectedCourseName = res.length > 0 ? res[0].course.name : '';
            this.selectedCourseDescription = res.length > 0 ? res[0].course.description : '';
        })
    });
   
  }

    onCourseSelection(courseId: number) {
        // Przekazanie ID do SectionManage
        this.router.navigate(['/section-manage', courseId]);
    }
  

}
