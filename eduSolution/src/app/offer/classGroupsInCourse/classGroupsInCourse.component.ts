import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/user/user-service/user.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { CartService } from '../cart/cart-service/cart.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-classGroupsInCourse',
  templateUrl: './classGroupsInCourse.component.html',
  styleUrls: ['./classGroupsInCourse.component.css']
})
export class ClassGroupsInCourseComponent implements OnInit {
  classGroupArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private route: ActivatedRoute, 
    private classGroupService: ClassGroupService, private loginService: LoginService, private cartService: CartService, private location: Location){

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
    this.filteredCourses = this.classGroupArray.filter((searchData:any) => {
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
  pendingClassGroups: any[] = [];
  inProgressClassGroups: any[] = [];
  completedClassGroups: any[] = [];
  loadAllCourse() {
    this.route.params.subscribe(params => {
        this.courseId = params['courseId'];
        this.classGroupService.findByCourseId(this.courseId).subscribe((res: any)=>{
            this.classGroupArray = res;
            this.filteredCourses= res;
            this.selectedCourseName = res.length > 0 ? res[0].course.name : '';
            this.selectedCourseDescription = res.length > 0 ? res[0].course.description : '';

            this.pendingClassGroups = this.classGroupArray.filter(group => group.classGroupStatus === 'OCZEKUJĄCY');
            this.inProgressClassGroups = this.classGroupArray.filter(group => group.classGroupStatus === 'WTRAKCIE');
            this.completedClassGroups = this.classGroupArray.filter(group => group.classGroupStatus === 'ZAKOŃCZONY');
        })
    });
   
  }

    onCourseSelection(courseId: number) {
        // Przekazanie ID do SectionManage
        this.router.navigate(['/section-manage', courseId]);
    }




    // ----------------------------------------------------------------------------------------------------------

    addToCart(classGroup: any) {
      console.log('Przed wysłaniem żądania do koszyka:', classGroup);
      const token = this.loginService.getToken();
      const _token = token.split('.')[1];
      const _atobData = atob(_token);
      const _finalData = JSON.parse(_atobData);
      const cartItem = {
        classGroup: classGroup.id,
        user: _finalData.id,
      };
  
      
      this.cartService.save(cartItem).subscribe(
        (response) => {
          console.log('Odpowiedź od serwera:', response);
          
        },
        (error) => {
          console.error('Błąd podczas dodawania do koszyka:', error);
        }
      );

      location.reload();
        
    }
  

    selectedStatus: string | null = null;
    filterClassGroupsByStatus(status: string): void {
      this.selectedStatus = status;
    
      // Jeśli status to "Wszystkie", wyświetl wszystkie classGroups
      if (status === 'Wszystkie') {
        this.filteredCourses = this.classGroupArray;
      } else {
        // W przeciwnym razie, wybierz classGroups o wybranym statusie
        this.filteredCourses = this.classGroupArray.filter(
          (classGroup) => classGroup.classGroupStatus === status
        );
      }
    }

    goBack() {
      this.location.back();
    }

}
