import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user/user-service/user.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-basic-course-grid-view',
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
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
    private userService: UserService, private loginService: LoginService, private sanitizer: DomSanitizer){

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

    onCourseSelection(courseId: number) {
    // Przekazanie ID do SectionManage
    this.router.navigate(['/section-manage', courseId]);
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

  getImageSource(encodedImage: string) {
    const imageUrl = `data:image/*;base64,${encodedImage}`;
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  

}
