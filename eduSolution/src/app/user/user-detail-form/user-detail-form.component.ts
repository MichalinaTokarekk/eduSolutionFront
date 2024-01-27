import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from 'src/app/course/course-service/course.service';
import { UserService } from '../user-service/user.service';
import { forkJoin } from 'rxjs';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { RegisterService } from 'src/app/authorization_authentication/register/register-service/register.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-detail-formg',
  templateUrl: './user-detail-form.component.html',
  styleUrls: ['./user-detail-form.component.css']
})
export class UserDetailFormComponent implements OnInit {
  userArray: any[] = [];
  filteredUsers: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  classGroups: any;
  editedUserClassGroups: string = '';
  allClassGroups: any[] = [];
  selectedClassGroups: number[] = [];
  constructor(private http: HttpClient, private userService: UserService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar,
    private loginService: LoginService, private classGroupService: ClassGroupService, private registerService: RegisterService, private route: ActivatedRoute, private location: Location){

  }

  selectedGroups: { [groupId: number]: boolean } = {};
  ngOnInit(): void {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);

    this.userService.findClassGroupsById(_finalData.id).subscribe((groupIds: string[]) => {
      this.classGroups = groupIds;
    });

    this.classGroupService.getAll().subscribe(groups => {
      this.allClassGroups = groups;
    });


    if (this.isEditing) {
      this.userArray.forEach(user => {
        user.classGroups.forEach((group: { id: number }) => {

          this.selectedGroups[group.id] = true;
        });
      });
    }

    this.route.params.subscribe(params => {
        const userId = params['userId'];
        this.userService.get(userId).subscribe(user => this.userArray = [user]);
    });
    
    
  }

  compareFn(group1: any, group2: any): boolean {
    return group1 && group2 ? group1.id === group2.id : group1 === group2;
  }
  

  isSelected(group: any): boolean {
    return this.selectedGroups[group.id] === true;
  }
  
  onGroupSelectionChange(group: any): void {
    this.selectedGroups[group.id] = !this.selectedGroups[group.id];
  }



  onNameSort() {
    const filteredData =  this.filteredUsers.sort((a: any, b: any) =>
    a.name.localeCompare(b.name));
    this.filteredUsers = filteredData;
  }

  filter(event: any) {
    this.filteredUsers = this.userArray.filter((searchData:any) => {
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

  
  onEdit(userObj: any) {
    this.oldUserObj = JSON.stringify(userObj);
    this.userArray.forEach(element => {
      element.isEdit = false;
    });
    userObj.isEdit = true;
  }


  onAdd() {
    const obj = {
    //   "id": 1,
      "firstName": "",
      "lastName": "",
      "email": "",
      "role": "USER",
      "address": "",
      "city": "",
      "post": "",
      "postCode": "",
      "country": "",
      "userStatus": "AKTYWNY",
      "isEdit": true,
      // classGroups: Object.keys(this.selectedGroups).map(Number)

    };
    this.userArray.unshift(obj);
  }

  onRemoveFirst() {
    if (this.userArray.length > 0) {
        this.userArray.shift(); // Usuń pierwszy element z tablicy
    }
}




onUpdate(userForm: NgForm, user: any) {
    console.log('Rozpoczęto aktualizację...');
  
    const formData = { ...userForm.value };
    console.log('Dane z formularza:', formData);
  
    if (!formData.firstName || formData.firstName.trim() === '') {
        console.log('Brak wymaganych danych. Przerwano aktualizację.');
        return;
    }
  
    const userData = { ...formData };
  
    console.log('Dane do aktualizacji:', userData);
  
    this.userService.updateUserWithoutPassword(userData)
        .subscribe(
            (data) => {
                console.log('Aktualizacja zakończona sukcesem:', data);
                user.isEdit = false;
            },
            (error) => {
                console.error('Błąd podczas aktualizacji:', error);
                console.log('Wysyłane dane:', userData);
            }
        );
  
    console.log('Zakończono aktualizację.');
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
        this.userService.remove(obj.id).subscribe(
          response => {
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


  validateUser(firstName: string) {
    if (!firstName) {
        this.isNameEmpty = true;
        return "Pole wymagane";
    } else {
        this.isNameEmpty = false;
        return "";
    }
}

isGroupSelected(classGroups: any[], group: any): boolean {
  return classGroups && classGroups.some(selectedGroup => selectedGroup.id === group.id);
}

goBack() {
  this.location.back();
}


}
