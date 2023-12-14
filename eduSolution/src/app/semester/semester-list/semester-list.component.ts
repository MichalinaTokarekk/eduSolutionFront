import { Component, OnInit } from '@angular/core';
// import { Observable } from '@rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SemesterService } from '../semester-service/semester.service';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Course } from 'src/app/interfaces/course-interface';
import { CourseService } from 'src/app/course/course-service/course.service';


@Component({
  selector: 'app-semester-list',
  templateUrl: './semester-list.component.html',
  styleUrls: ['./semester-list.component.css']
})
export class SemesterListComponent implements OnInit{
  semesters!: Array<any>;

courseArray: any[] = [];
  filteredSemesters: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  constructor(private http: HttpClient, private semesterService: SemesterService, private courseService: CourseService, 
    private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar){

  }

//   Multiselect:

public courseMultiCtrl: FormControl = new FormControl();
public filteredCoursesMulti: ReplaySubject<Course[]> = new ReplaySubject<Course[]>(1);
selectedCourseNames: string[] = [];


  ngOnInit(): void {
    this.loadList();
    this.courseService.getAll().subscribe (data => {

        this.filteredCoursesMulti.next(data.slice());
    });

    
    this.courseMultiCtrl.valueChanges.subscribe(selectedAuthors => {
        this.selectedCourseNames = selectedAuthors.map((course: { name: any; }) => course.name);
    });

    const selectedCoursesStr = localStorage.getItem('selectedCourses');
    if (selectedCoursesStr) {
      const selectedCourses = JSON.parse(selectedCoursesStr);
      this.selectedCourseNames = selectedCourses.map((course: { name: any; }) => course.name);
    }

  }
  onNameSort() {
    const filteredData =  this.filteredSemesters.sort((a: any, b: any) =>
    a.name.localeCompare(b.name));
    this.filteredSemesters = filteredData;
  }

  filter(event: any) {
    this.filteredSemesters = this.courseArray.filter((searchData:any) => {
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

  loadAllUser() {
    this.semesterService.getAll().subscribe((res: any)=>{
      this.courseArray = res;
      this.filteredSemesters= res;
    })
  }

  loadList() {
    this.semesterService.getAll().subscribe (data => {
      this.courseArray = data;
      this.filteredSemesters = data

    })
  }

  
  onEdit(userObj: any) {
    this.oldUserObj = JSON.stringify(userObj);
    this.courseArray.forEach(element => {
      element.isEdit = false;
    });
    userObj.isEdit = true;
  }


  onAdd() {
    const obj = {
    //   "id": 1,
      "name": "",
      "description": "",
      "courses": [],
      "isEdit": true
    };
    this.courseArray.unshift(obj);
  }

  onRemoveFirst() {
    if (this.courseArray.length > 0) {
        this.courseArray.shift(); // Usuń pierwszy element z tablicy
    }
}

    onUpdate(userObj: any) {
        // write api call and send obj
      if (!userObj.name || userObj.name.trim() === '') {
        // Jeśli pole "name" jest puste, nie wykonuj aktualizacji
        return;
      }
      const selectedCourses = this.selectedCourseNames.map((courseName: string) => {
        return { name: courseName }; // Zakładając, że masz dostęp do nazw kursów
       });
       localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
    //    console.log('Wybrane kursy zapisane w localStorage:', selectedCourses);
    //    console.log('Dane wysyłane do serwera:', userObj);


        userObj.courses = selectedCourses;
      this.semesterService.save(userObj)
          .subscribe(
            (data) => {
                // Obsłuż dane po udanej aktualizacji
                console.log('Aktualizacja zakończona sukcesem:', userObj);
                console.log('Dane wysyłane do serwera:', userObj);
                userObj.isEdit = false;

            },
            (error) => {
                console.error('Błąd podczas aktualizacji:', error);
            }
          );
          console.log('Dane wysyłane do serwera:', userObj);

        
    }


  onCancel(obj:any) {
    if (this.oldUserObj) {
      const oldObj = JSON.parse(this.oldUserObj);
      // obj.name = oldObj.name;
      // obj.description = oldObj.description;
      obj.isEdit = false;
  } else {
    obj.isEdit = false;
    this.onRemoveFirst();

  }
  }

onDelete(obj: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.semesterService.remove(obj.id).subscribe(
          response => {
            this.loadList();
            this.openSnackBar('Pole usunięte pomyślnie', 'Success');
          },
          error => {
            let errorMessage = 'An error occurred';
            if (error && error.error) {
              errorMessage = error.error;
            }
            this.openSnackBar(errorMessage, 'Error');
          }
        );
      }
    });
  }
  

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000, // Czas wyświetlania powiadomienia (w milisekundach)
    });
  }

  isNameEmpty = false;


  validateCourseName(name: string) {
    if (!name) {
        this.isNameEmpty = true;
        return "Pole wymagane";
    } else {
        this.isNameEmpty = false;
        return "";
    }
}

}
