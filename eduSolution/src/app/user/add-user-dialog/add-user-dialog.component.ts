// add-event-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroup } from 'src/app/interfaces/classGroup-interface';
import { Course } from 'src/app/interfaces/course-interface';
import { UserService } from '../user-service/user.service';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.css']
})
export class AddUserDialogComponent {
    availableCourses: Course[] = [];
    availableClassGroups: ClassGroup[] = [];
    availableRoles: string[] = ['USER', 'ADMIN']; // Dodaj role, które chcesz udostępnić
    availableUserStatus: string[] = ['AKTYWNY', 'NIEAKTYWNY'];
    

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, private classGroupService: ClassGroupService
  ) {
    this.availableCourses = data.availableCourses;
    this.availableClassGroups = data.availableClassGroups;
    this.availableCourses = data.availableCourses;
    this.availableClassGroups = data.availableClassGroups;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log('availableCourses', this.availableCourses);
    console.log('availableClassGroups', this.availableClassGroups);
    this.loadAvailableClassGroups();
  }

  

  onCancelClick(): void {
    this.dialogRef.close();
  }


  onAddClick(): void {
    const newEvent = {
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      email: this.data.email,
      address: this.data.email,
      city: this.data.email,
      post: this.data.email,
      postCode: this.data.email,
      country: this.data.email,
    //   classGroups: this.data.classGroups,
    classGroups: this.data.classGroups.map((group: { id: any; }) => group.id),
      role: this.data.role,
      userStatus: this.data.userStatus
    };

    this.userService.save(newEvent).subscribe(
      (result) => {
        console.log('Nowe wydarzenie zostało zapisane', result);
        this.dialogRef.close(true); 
      },
      (error) => {
        console.error('Błąd podczas zapisywania wydarzenia', error);
      }
    );
  }

  originalClassGroups: ClassGroup[] = [];

  loadAvailableClassGroups() {
    this.classGroupService.getAll().subscribe(
      (classGroups) => {
        // this.availableClassGroups = classGroups;
        this.originalClassGroups = classGroups;
      this.availableClassGroups = [...this.originalClassGroups];
      },
      (error) => {
        console.error('Błąd podczas pobierania grup klasowych', error);
      }
    );
  }

  isSelectAllSelected = false;

  toggleSelectAll(): void {
    if (this.isSelectAllSelected) {
      // Jeśli "Select All" jest zaznaczone, odznacz wszystkie
      this.data.classGroups = [];
    } else {
      // Zaznacz wszystkie, usuń inne zaznaczenia
      this.data.classGroups = [...this.availableClassGroups];
    }

    // Zmiana statusu "Select All"
    this.isSelectAllSelected = !this.isSelectAllSelected;
  }

  onSearchChange(event: any): void {
    const searchValue = event?.target?.value || ''; 
    this.availableClassGroups = this.originalClassGroups.filter(user => {
      const lastName = user.name.toLowerCase();
      return lastName.startsWith(searchValue.toLowerCase());
    });
  }
  
}
