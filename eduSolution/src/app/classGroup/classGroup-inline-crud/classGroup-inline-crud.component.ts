import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroupService } from '../classGroup-service/classGroup.service';
import { SemesterService } from 'src/app/semester/semester-service/semester.service';
import { Semester } from 'src/app/interfaces/semester-interface';
import { Course } from 'src/app/interfaces/course-interface';

@Component({
  selector: 'app-basic-inline-editing',
  templateUrl: './classGroup-inline-crud.component.html',
  styleUrls: ['./classGroup-inline-crud.component.css']
})
export class ClassGroupInlineCrudComponent implements OnInit {
  classGroupArray: any[] = [];
  filteredClassGroups: any []= [];
  oldUserObj: any;
  searchText ='';
  isEditing = false;
  semesters!: Semester[];
  availableCourses!: Course[];
  ascendingSort = true;
  constructor(private http: HttpClient, private classGroupService: ClassGroupService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
    private semesterService: SemesterService, private courseService: CourseService){

  }
  ngOnInit(): void {
    this.loadList();
    this.loadSemesters();
    this.loadAvailableCourses();
  }
  onNameSort() {
    const filteredData =  this.filteredClassGroups.sort((a: any, b: any) =>
    a.name.localeCompare(b.name));
    this.filteredClassGroups = filteredData;
  }

  onLpSort() {
    // Filtruj dane, aby pominięte były undefined wartości
    const filteredAndParsedData = this.filteredClassGroups
      .filter((classGroup: any) => classGroup.srNo !== undefined)
      .map((classGroup: any) => ({
        ...classGroup,
        srNo: Number(classGroup.srNo)
      }));
  
    const sortedData = filteredAndParsedData.sort((a: any, b: any) => {
      if (this.ascendingSort) {
        return a.srNo - b.srNo; // Sortowanie rosnące liczb
      } else {
        return b.srNo - a.srNo; // Sortowanie malejąco liczb
      }
    });
  
    this.filteredClassGroups = sortedData;
    this.ascendingSort = !this.ascendingSort;
  }

  filter(event: any) {
    this.filteredClassGroups = this.classGroupArray.filter((searchData:any) => {
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
    this.classGroupService.getAll().subscribe((res: any)=>{
      this.classGroupArray = res;
      this.filteredClassGroups= res;
    })
  }

  loadList() {
    this.classGroupService.getAll().subscribe (data => {
      this.classGroupArray = data;
      this.filteredClassGroups = data

    })
  }

  
  onEdit(userObj: any) {
    this.oldUserObj = JSON.stringify(userObj);
    this.classGroupArray.forEach(element => {
      element.isEdit = false;
    });
    userObj.isEdit = true;
  }


  onAdd() {
    const obj = {
    //   "id": 1,
      "name": "",
      "isEdit": true
    };
    this.classGroupArray.unshift(obj);
  }

  onRemoveFirst() {
    if (this.classGroupArray.length > 0) {
        this.classGroupArray.shift(); // Usuń pierwszy element z tablicy
    }
}

  onUpdate(userObj: any) {
      // write api call and send obj
    if (!userObj.name || userObj.name.trim() === '') {
      // Jeśli pole "name" jest puste, nie wykonuj aktualizacji
      return;
    }
    this.classGroupService.save(userObj)
        .subscribe(
          (data) => {
              // Obsłuż dane po udanej aktualizacji
              console.log('Aktualizacja zakończona sukcesem:', data);
              userObj.isEdit = false;

          },
          (error) => {
              console.error('Błąd podczas aktualizacji:', error);
          }
        );
      
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
        this.classGroupService.remove(obj.id).subscribe(
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

  loadSemesters() {
    this.semesterService.getAll().subscribe((semesters: Semester[]) => {
      console.log('Semesters:', semesters);
      this.semesters = semesters; // bez używania .map()
    });
  }
  

  loadAvailableCourses() {
    this.courseService.getAll().subscribe((courses: Course[]) => {
      this.availableCourses = courses;
    });
  }
  


  
  

}
