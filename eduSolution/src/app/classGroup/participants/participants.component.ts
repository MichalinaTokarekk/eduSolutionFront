// Importy...
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';
import { UserService } from 'src/app/user/user-service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { Role } from 'src/app/interfaces/role-interface';
import { ConfirmationDialogSemesterComponent } from 'src/app/confirmations/semester/confirmation-dialog-semester.component';
import { MatDialog } from '@angular/material/dialog';
import { ClassGroup } from 'src/app/interfaces/classGroup-interface';

@Component({
  selector: 'app-offer-description',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  classGroupId: number | undefined;
  classGroup: any; 
  usersByClassGroup: any[] = [];
  teachersByClassGroup: any[] = [];
  allUsers: any[] = [];
  selectedGroups: { [groupId: number]: boolean } = {};
  filteredUsers: any[] = [];
  filteredTeachers: any[] = [];
  selectStudents: any[] = [];
  selectTeachers: any[] = [];
  studentsLimit: any;
  user: any; 
  selectedClassGroup: string = '';
  

  constructor(private route: ActivatedRoute, private classGroupService: ClassGroupService, private location: Location, private userService: UserService,
    private snackBar: MatSnackBar, private loginService: LoginService, private dialog: MatDialog) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('classGroupId');
  
      // Sprawdź, czy id nie jest null
      if (id !== null) {
        this.classGroupId = +id;
        console.log('this.classGroupId:', this.classGroupId);
        console.log('Przed wywołaniem findUsersByClassGroupId');
        const token = this.loginService.getToken();
        const _token = token.split('.')[1];
        const _atobData = atob(_token);
        const _finalData = JSON.parse(_atobData);
        const userRole: Role = Role.USER; 
        const userRoleAsString: string = this.roleEnumToString(userRole);
        const teacherRole: Role = Role.TEACHER; 
        const teacherRoleAsString: string = this.roleEnumToString(teacherRole);
        this.userService.findUsersByClassGroupIdAndRole(id, userRoleAsString).subscribe(
          users => {
            console.log('Odpowiedź z serwera:', users);
            this.usersByClassGroup = users;
            console.log('Użytkownicy przypisani do klasy:', this.usersByClassGroup);
          },
          error => {
            console.error('Błąd podczas pobierania użytkowników:', error);
          }
        );

        this.classGroupService.get(id).subscribe(
            classGroup => {
              this.classGroup = classGroup;
              this.selectedClassGroup = (classGroup as ClassGroup).name;
              this.studentsLimit = this.classGroup.studentsLimit;
              console.log(this.studentsLimit);
            },
            error => {
              console.error('Błąd podczas pobierania informacji o klasie:', error);
            }
          );

        this.userService.findUsersByClassGroupIdAndRole(id, teacherRoleAsString).subscribe(
            teachers => {
              console.log('Odpowiedź z serwera:', teachers);
              this.teachersByClassGroup = teachers;
              console.log('Użytkownicy przypisani do klasy:', this.usersByClassGroup);
            },
            error => {
              console.error('Błąd podczas pobierania użytkowników:', error);
            }
          );
        
        console.log('Po wywołaniu findUsersByClassGroupId');
      } else {
        console.error('classGroupId jest null');
      }
    });

    

    const userRole: Role = Role.USER; 
    const userRoleAsString: string = this.roleEnumToString(userRole);
    this.userService.getUsersByRole(userRoleAsString).subscribe(
        (students) => {
            this.selectStudents = students
        }
    );

    const teacherRole: Role = Role.TEACHER; 
    const teacherRoleAsString: string = this.roleEnumToString(teacherRole);
    this.userService.getUsersByRole(teacherRoleAsString).subscribe(
        (teachers) => {
            this.selectTeachers = teachers
        }
    );

    this.userService.getAll().subscribe(
        (data) => {
            this.allUsers = data;
            this.filteredUsers = this.selectStudents.slice();
            this.filteredTeachers = this.selectTeachers.slice();
        }
    )
  }

roleEnumToString(role: Role): string {
    switch (role) {
      case Role.USER:
        return 'USER';
      case Role.TEACHER:
        return 'TEACHER';
      // Dodaj pozostałe przypadki, jeśli istnieją inne role
      default:
        throw new Error('Nieobsługiwana rola.');
    }
  }

  onSearchChange(event: any): void {
    const searchValue = event?.target?.value || ''; // Sprawdzenie null przed dostępem do target i value
    // Filtruj użytkowników na podstawie wprowadzonego znaku
    this.filteredUsers = this.selectStudents.filter(user => {
      const lastName = user.lastName.toLowerCase();
      return lastName.startsWith(searchValue.toLowerCase());
    });

    this.filteredTeachers = this.selectTeachers.filter(user => {
        const lastName = user.lastName.toLowerCase();
        return lastName.startsWith(searchValue.toLowerCase());
      });
  }
  

  
  goBack() {
    this.location.back();
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


onSubmit() {
    console.log('Submit button clicked');
    console.log('Selected users:', this.usersByClassGroup);
  
    // Sprawdź, czy classGroup został zainicjowany
    if (!this.classGroupId) {
      console.error('Błąd: Brak zdefiniowanej grupy lub identyfikatora grupy.');
      return;
    }
  
    // Aktualizuj użytkowników w bazie danych
    for (const user of this.usersByClassGroup) {
      // Sprawdź, czy użytkownik posiada tablicę classGroups
      if (!user.classGroups) {
        user.classGroups = [];
      }
  
      // Sprawdź, czy classGroupId już nie istnieje w tablicy, aby uniknąć duplikatów
      if (!user.classGroups.includes(this.classGroupId)) {
        user.classGroups.push(this.classGroupId);
      }
  
      // Aktualizuj użytkownika w bazie danych
      this.userService.updateUserClassGroup(user).subscribe(
        response => {
          console.log('Zaktualizowano użytkownika:', response);
        },
        error => {
        //   console.error('Błąd podczas aktualizacji użytkownika:', error);

          this.snackBar.open('Osiągnieto limit użytkowników w tej grupie.', 'Zamknij', {
            duration: 5000, // Duration in milliseconds
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          // Dodaj poniższy console.log, aby wyświetlić dokładną treść błędu
          console.log('Treść błędu:', error);
  
        //   alert('Błąd podczas aktualizacji użytkownika. Sprawdź konsolę dla więcej informacji.');
        }
      );
    }



    for (const user of this.teachersByClassGroup) {
        // Sprawdź, czy użytkownik posiada tablicę classGroups
        if (!user.classGroups) {
          user.classGroups = [];
        }
    
        // Sprawdź, czy classGroupId już nie istnieje w tablicy, aby uniknąć duplikatów
        if (!user.classGroups.includes(this.classGroupId)) {
          user.classGroups.push(this.classGroupId);
        }
    
        // Aktualizuj użytkownika w bazie danych
        this.userService.updateUserClassGroup(user).subscribe(
          response => {
            console.log('Zaktualizowano użytkownika:', response);
          },
          error => {
          //   console.error('Błąd podczas aktualizacji użytkownika:', error);
  
            this.snackBar.open('Osiągnieto limit użytkowników w tej grupie.', 'Zamknij', {
              duration: 5000, // Duration in milliseconds
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            // Dodaj poniższy console.log, aby wyświetlić dokładną treść błędu
            console.log('Treść błędu:', error);
    
          //   alert('Błąd podczas aktualizacji użytkownika. Sprawdź konsolę dla więcej informacji.');
          }
        );
      }
      location.reload();
  }

  onDeleteClassGroupFromUser(user: any, classGroup: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);
    const index = user.classGroups.findIndex((cg: any) => cg.id === classGroup.id);
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
    if (index !== -1) {
      user.classGroups.splice(index, 1);
  
      this.userService.updateUserClassGroup(user).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          location.reload();
        },
        (error) => {
          console.error('Error updating user:', error);
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

  
onDelete(obj: any) {
  const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);

  dialogRef.afterClosed().subscribe((result: boolean) => {
    if (result === true) {
      this.classGroupService.remove(obj.id).subscribe(
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
  
  
  

}
