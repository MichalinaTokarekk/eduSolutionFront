// add-event-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroup } from 'src/app/interfaces/classGroup-interface';
import { Course } from 'src/app/interfaces/course-interface';
import { EventsScheduleService } from '../eventsSchedule-service/eventsSchedule.service';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './addEventDialog.component.html',
  styleUrls: ['./addEventDialog.component.css']
})
export class AddEventDialogComponent {
    availableCourses: Course[] = [];
    availableClassGroups: ClassGroup[] = [];
    

  constructor(
    public dialogRef: MatDialogRef<AddEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private courseService: CourseService, private classGroupService: ClassGroupService, private eventService: EventsScheduleService
  ) {
    this.availableCourses = data.availableCourses;
    this.availableClassGroups = data.availableClassGroups;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log('availableCourses', this.availableCourses);
    console.log('availableClassGroups', this.availableClassGroups);
    this.loadAvailableCourses();
    this.loadAvailableClassGroups();
  }

  

  onCancelClick(): void {
    this.dialogRef.close();
  }
  onAddClick(): void {
    // Wygeneruj obiekt lesson do zapisania
    const newEvent = {
      name: this.data.eventName,
      description: this.data.description,
      eventDate: this.data.eventDate,
      startEventTime: this.data.startEventTime,
      endEventTime: this.data.endEventTime,
      courses: this.data.courses,
      classGroups: this.data.classGroups,
    };

    // Zapisz nowe wydarzenie
    this.eventService.save(newEvent).subscribe(
      (result) => {
        console.log('Nowe wydarzenie zostało zapisane', result);
        this.dialogRef.close(true); // Zamknij okno dialogowe po udanym zapisie
      },
      (error) => {
        console.error('Błąd podczas zapisywania wydarzenia', error);
        // Tutaj można dodać obsługę błędu, np. wyświetlić komunikat użytkownikowi
      }
    );
  }


  loadAvailableCourses() {
    this.courseService.getAll().subscribe(
      (courses) => {
        this.availableCourses = courses;
      },
      (error) => {
        console.error('Błąd podczas pobierania kursów', error);
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

  // toggleSelectAll(): void {
  //   if (this.data.classGroups.length === this.availableClassGroups.length) {
  //     // Jeśli wszystkie są zaznaczone, odznacz wszystkie
  //     this.data.classGroups = [];
  //   } else {
  //     // Zaznacz wszystkie, usuń inne zaznaczenia
  //     this.data.classGroups = [...this.availableClassGroups];
  //   }
  // }

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
