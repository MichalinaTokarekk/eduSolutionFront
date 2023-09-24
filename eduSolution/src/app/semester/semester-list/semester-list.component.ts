import { Component, OnInit } from '@angular/core';
// import { Observable } from '@rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SemesterService } from '../semester-service/semester.service';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';


@Component({
  selector: 'app-semester-list',
  templateUrl: './semester-list.component.html',
  styleUrls: ['./semester-list.component.css']
})
export class SemesterListComponent implements OnInit{
  semesters!: Array<any>;
  dialog: any;

  constructor (private semesterService : SemesterService, private router: Router, private snackBar: MatSnackBar, private dialogg: MatDialog) {}

  
  ngOnInit(){
    this.loadList();

  }

  loadList() {
    this.semesterService.getAll().subscribe (data => {
      this.semesters = data;


    })
  }

  gotoList() {
    this.router.navigate(['/semester-list']);
  }


  errorMessage: string = '';
  


  remove(id: string) {
    const dialogRef = this.dialogg.open(ConfirmationDialogSemesterComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.semesterService.remove(id).subscribe(
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

//   actions(){
//     if(this.loginService.getToken()!=''){
//       let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
//       if(_currentRole=='admin' || _currentRole=='librarian'){
//         return true;
//       }
//     }
//     return false
//   }


}
