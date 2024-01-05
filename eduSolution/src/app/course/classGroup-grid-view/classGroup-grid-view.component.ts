import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../course-service/course.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user/user-service/user.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';

@Component({
  selector: 'app-basic-classGroup-grid-view',
  templateUrl: './classGroup-grid-view.component.html',
  styleUrls: ['./classGroup-grid-view.component.css']
})
export class ClassGroupGridViewComponent implements OnInit {
  courseArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  selectedStatus: string | null = null;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
    private userService: UserService, private loginService: LoginService, private route: ActivatedRoute, private classGroupService: ClassGroupService){

  }
  ngOnInit(): void {
    this.loadAllCourse();
  }

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
    this.router.navigate(['/course-grid-view']);
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

  pendingClassGroups: any[] = [];
  inProgressClassGroups: any[] = [];
  completedClassGroups: any[] = [];
  courseId!: number;
  selectedCourseName: string = '';
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

            this.pendingClassGroups = this.courseArray.filter(group => group.classGroupStatus === 'OCZEKUJĄCY');
            this.inProgressClassGroups = this.courseArray.filter(group => group.classGroupStatus === 'WTRAKCIE');
            this.completedClassGroups = this.courseArray.filter(group => group.classGroupStatus === 'ZAKOŃCZONY');
        });
    });
   
  }

  // loadList() {
  //   const token = this.loginService.getToken();
  //   const _token = token.split('.')[1];
  //   const _atobData = atob(_token);
  //   const _finalData = JSON.parse(_atobData); 


  //   this.userService.findClassGroupsById(_finalData.id).subscribe (data => {
  //     this.courseArray = data;
  //     this.filteredCourses = data

  //   })
  // }

  // W CourseGridViewComponent
    onCourseSelection(courseId: number) {
        // Przekazanie ID do SectionManage
        this.router.navigate(['/section-manage', courseId]);
  }
  

}
