// Importy...
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';
import { UserService } from 'src/app/user/user-service/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-offer-description',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  classGroupId: number | undefined;
  classGroup: any; 
  usersByClassGroup: any[] = [];
  allUsers: any[] = [];
  selectedGroups: { [groupId: number]: boolean } = {};
  filteredUsers: any[] = [];
  

  constructor(private route: ActivatedRoute, private classGroupService: ClassGroupService, private location: Location, private userService: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('classGroupId');
  
      // Sprawdź, czy id nie jest null
      if (id !== null) {
        this.classGroupId = +id;
        console.log('this.classGroupId:', this.classGroupId);
        console.log('Przed wywołaniem findUsersByClassGroupId');
        this.userService.findUsersByClassGroupId2(id).subscribe(
          users => {
            console.log('Odpowiedź z serwera:', users);
            this.usersByClassGroup = users;
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

    this.userService.getAll().subscribe(
        (data) => {
            this.allUsers = data;
            this.filteredUsers = this.allUsers.slice();
        }
    )
  }

  onSearchChange(event: any): void {
    const searchValue = event?.target?.value || ''; // Sprawdzenie null przed dostępem do target i value
    // Filtruj użytkowników na podstawie wprowadzonego znaku
    this.filteredUsers = this.allUsers.filter(user => {
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
  }

}
