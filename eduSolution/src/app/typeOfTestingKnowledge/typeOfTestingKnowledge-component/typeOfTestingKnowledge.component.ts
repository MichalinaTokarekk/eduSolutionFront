import { Component, OnInit } from '@angular/core';
// import { Observable } from '@rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReplaySubject, catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Course } from 'src/app/interfaces/course-interface';
import { CourseService } from 'src/app/course/course-service/course.service';
import { TypeOfTestingKnowledgeService } from '../typeOfTestingKnowledge-service/typeOfTestingKnowledge.service';


@Component({
  selector: 'app-semester-list',
  templateUrl: './typeOfTestingKnowledge.component.html',
  styleUrls: ['./typeOfTestingKnowledge.component.css']
})
export class TypeOfTestingKnowledgeComponent implements OnInit{
typeOfTestingKnowledges!: Array<any>;
typeOfTestingKnowledgeArray: any[] = [];
filteredTypeOfTestingKnowledgesArray: any []= [];
oldUserObj: any;
searchText: string ='';
isEditing = false;
constructor(private http: HttpClient, private courseService: CourseService, 
private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService){

}


public courseMultiCtrl: FormControl = new FormControl();
public filteredCoursesMulti: ReplaySubject<Course[]> = new ReplaySubject<Course[]>(1);
selectedCourseNames: string[] = [];


  ngOnInit(): void {
    this.loadList();
  }


  onNameSort() {
    const filteredData =  this.filteredTypeOfTestingKnowledgesArray.sort((a: any, b: any) =>
    a.name.localeCompare(b.name));
    this.filteredTypeOfTestingKnowledgesArray = filteredData;
  }


  

  loadList() {
    this.typeOfTestingKnowledgeService.getAll().subscribe (data => {
      this.typeOfTestingKnowledgeArray = data;
      this.filteredTypeOfTestingKnowledgesArray = data

    })
  }

  
  onEdit(userObj: any) {
    this.oldUserObj = JSON.stringify(userObj);
    this.typeOfTestingKnowledgeArray.forEach(element => {
      element.isEdit = false;
    });
    userObj.isEdit = true;
  }


  onAdd() {
    const obj = {
      "name": "",
      "description": "",
      "weight": "",
      "isEdit": true
      
    };
    console.log("Adding new object:", obj);
    this.typeOfTestingKnowledgeArray.unshift(obj);
  }

  onRemoveFirst() {
    if (this.typeOfTestingKnowledgeArray.length > 0) {
        this.typeOfTestingKnowledgeArray.shift(); // Usuń pierwszy element z tablicy
    }
  }

    onUpdate(userObj: any) {
        // write api call and send obj
      if (!userObj.name || userObj.name.trim() === '') {
        // Jeśli pole "name" jest puste, nie wykonuj aktualizacji
        return;
      }


      this.typeOfTestingKnowledgeService.save(userObj)
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
        this.typeOfTestingKnowledgeService.remove(obj.id).subscribe(
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

isValidWeight(value: any): boolean {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) && parsedValue >= 0;
}


}
