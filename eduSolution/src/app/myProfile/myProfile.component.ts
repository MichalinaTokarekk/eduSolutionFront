import { Component, OnInit,  ViewChild, AfterViewInit } from '@angular/core';
// import { Observable } from '@rxjs';

import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, catchError, of, take, takeUntil, tap } from 'rxjs';
import { VERSION } from '@angular/material/core';
import { User } from 'src/app/interfaces/user-interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../user/user-service/user.service';
import { LoginService } from '../authorization_authentication/service/login.service';
import { ChangePassword } from '../interfaces/changePassword-interface';



@Component({
  selector: 'app-user-list',
  templateUrl: './myProfile.component.html',
  styleUrls: ['./myProfile.component.css']

})
export class MyProfileComponent implements OnInit{
  constructor (private userService: UserService, private loginService: LoginService, private router: Router, private snackBar: MatSnackBar, 
    private dialogg: MatDialog) {}
  user!: any
  version = VERSION;
  booleanValue!: boolean;
  

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();


  ngOnInit(){
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
    // this.userService.get(_finalData.id).subscribe(user => {
        // const id = _finalData.id;
        this.loadProfile(_finalData.id);
      // });
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  gotoList() {
    this.router.navigate(['/user-list']);
  }

  loadProfile(id: string) {
    this.userService.get(id).subscribe (data => {
      this.user = data;

      if (!this.user.changePassword) {
        this.user.changePassword = {
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        };
      }
    });
  }

  isEditing = false; 
  isEditingPassword = false; 

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  toggleEditPassword() {
    this.isEditingPassword = true;
  }

  // changePassword(changePassword: any){
  //   this.profileService.changePassword(changePassword);
  //   this.isEditingPassword = !this.isEditingPassword;
  // }



  changePassword(changePassword: ChangePassword){
    changePassword.id = this.user.id;
    this.userService.changePassword(changePassword).subscribe(() => {
      this.isEditingPassword = !this.isEditingPassword;
      this.openSnackBar('Hasło zostało pomyślnie zmienione');

      setTimeout(() => {
        location.reload();
      }, 3000);
    });
    
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Zamknij', {
      duration: 3000, // Czas trwania okna (w milisekundach)
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

showPassword: boolean = false;
showPasswordConfirm: boolean = false;
showOldPassword: boolean = false;

toggleShowOldPassword(): void {
  this.showOldPassword = !this.showOldPassword;
  this.showPassword = false; // Wyłącz showPassword
  this.showPasswordConfirm = false; // Wyłącz showPasswordConfirm
}

toggleShowPassword(): void {
  this.showPassword = !this.showPassword;
  this.showPasswordConfirm = false; // Wyłącz showPasswordConfirm
}

toggleShowPasswordConfirm(): void {
  this.showPasswordConfirm = !this.showPasswordConfirm;
  this.showPassword = false; // Wyłącz showPassword
}
  

}
