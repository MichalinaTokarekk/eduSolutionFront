// Importy...
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';
import { UserService } from 'src/app/user/user-service/user.service';

@Component({
  selector: 'app-offer-description',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  classGroupId: number | undefined;
  classGroup: any; 
  usersByClassGroup: any[] = [];

  

  constructor(private route: ActivatedRoute, private classGroupService: ClassGroupService, private location: Location, private userService: UserService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('classGroupId');
  
      // Sprawdź, czy id nie jest null
      if (id !== null) {
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
  }

  
  goBack() {
    this.location.back();
  }

//   findUsersByClassGroupId(): void {
//     console.log('Przed wywołaniem findUsersByClassGroupId');
//     this.userService.findUsersByClassGroupId(this.id).subscribe(
//       users => {
//         console.log('Odpowiedź z serwera:', users);
//         this.usersByClassGroup = users;
//         console.log('Użytkownicy przypisani do klasy:', this.usersByClassGroup);
//       },
//       error => {
//         console.error('Błąd podczas pobierania użytkowników:', error);
//       }
//     );
//     console.log('Po wywołaniu findUsersByClassGroupId');
//   }

}
