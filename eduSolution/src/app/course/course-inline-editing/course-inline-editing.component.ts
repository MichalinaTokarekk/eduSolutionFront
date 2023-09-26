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
  templateUrl: './course-inline-editing.component.html',
  styleUrls: ['./course-inline-editing.component.css']
})
export class CourseInlineEditingComponent implements OnInit {
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

  loadAllUser() {
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
      this.courseService.save(userObj)
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

    // onUpdate(userObj: any) {
    //     // Wywołanie metody save z CourseService do aktualizacji danych lub zapisania nowego kursu
    //     this.courseService.save(userObj).subscribe(
    //       (data) => {
    //         // Obsłuż dane po udanej aktualizacji lub dodaniu nowego kursu
    //         console.log('Aktualizacja/zapis zakończony sukcesem:', data);
    
    //         // Jeśli serwer zwrócił nowy identyfikator (typowe dla dodawania), zaktualizuj go w kursie
    //         if (data.id) {
    //           userObj.id = data.id;
    //         }
    
    //         // Jeśli obiekt nie ma identyfikatora, oznacza to, że to nowy kurs, dodaj go do listy
    //         if (!userObj.id) {
    //           this.courseArray.unshift(userObj);
    //         }
    
    //         // Zakończ tryb edycji
    //         userObj.isEdit = false;
    //       },
    //       (error) => {
    //         // Obsłuż błąd
    //         console.error('Błąd podczas aktualizacji/zapisu:', error);
    //       }
    //     );
    //   }
    



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

//    onDelete(obj: any) {
//     this.courseService.remove(obj.id)
//       .subscribe(
//         () => {
//         //   Po udanym usunięciu, usuń kurs z tablicy
//           const index = this.courseArray.indexOf(obj);
//           if (index !== -1) {
//             this.courseArray.splice(index, 1);
//           }
          
//         },
//         (error) => {
//           console.error('Błąd podczas usuwania kursu:', error);
//         }
//       );
//   }


onDelete(obj: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.courseService.remove(obj.id).subscribe(
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
