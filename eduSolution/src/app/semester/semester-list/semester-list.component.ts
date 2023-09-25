import { Component, OnInit } from '@angular/core';
// import { Observable } from '@rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SemesterService } from '../semester-service/semester.service';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-semester-list',
  templateUrl: './semester-list.component.html',
  styleUrls: ['./semester-list.component.css']
})
export class SemesterListComponent implements OnInit{
  semesters!: Array<any>;
//   dialog: any;

//   constructor (private semesterService : SemesterService, private router: Router, private snackBar: MatSnackBar, private dialogg: MatDialog) {}

  
//   ngOnInit(){
//     this.loadList();

//   }

//   loadList() {
//     this.semesterService.getAll().subscribe (data => {
//       this.semesters = data;


//     })
//   }

//   gotoList() {
//     this.router.navigate(['/semester-list']);
//   }


//   errorMessage: string = '';
  


//   remove(id: string) {
//     const dialogRef = this.dialogg.open(ConfirmationDialogSemesterComponent);

//     dialogRef.afterClosed().subscribe((result: boolean) => {
//       if (result === true) {
//         this.semesterService.remove(id).subscribe(
//           response => {
//             this.loadList();
//             this.openSnackBar('Pole usunięte pomyślnie', 'Success');
//           },
//           error => {
//             let errorMessage = 'An error occurred';
//             if (error && error.error) {
//               errorMessage = error.error;
//             }
//             this.openSnackBar(errorMessage, 'Error');
//           }
//         );
//       }
//     });
//   }
  

//   openSnackBar(message: string, action: string) {
//     this.snackBar.open(message, action, {
//       duration: 5000, // Czas wyświetlania powiadomienia (w milisekundach)
//     });
//   }

//   actions(){
//     if(this.loginService.getToken()!=''){
//       let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
//       if(_currentRole=='admin' || _currentRole=='librarian'){
//         return true;
//       }
//     }
//     return false
//   }


courseArray: any[] = [];
  filteredSemesters: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  constructor(private http: HttpClient, private semesterService: SemesterService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar){

  }
  ngOnInit(): void {
    this.loadList();
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
      this.semesterService.save(userObj)
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
