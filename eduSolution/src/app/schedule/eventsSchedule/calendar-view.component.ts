import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventsScheduleService } from './eventsSchedule-service/eventsSchedule.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEventDialogComponent } from './addEventDialog/addEventDialog.component';
import { Course } from 'src/app/interfaces/course-interface';
import { ClassGroup } from 'src/app/interfaces/classGroup-interface';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';


@Component({
  selector: 'app-root',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: 'pl', 
    events: []
  };


  constructor(private eventService: EventsScheduleService, private dialog: MatDialog, private courseService: CourseService, private classGroupService: ClassGroupService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAll().subscribe(
      (events) => {
        // Mapowanie pól z backendu na oczekiwane przez FullCalendar
        const mappedEvents = events.map((event: { name: any; eventDate: any; }) => {
          return {
            title: event.name,        // Mapuj nazwę z pola 'name' na 'title'
            start: event.eventDate    // Mapuj datę z pola 'eventDate' na 'start'
          };
        });
  
        this.calendarOptions.events = mappedEvents;
      },
      (error) => {
        console.error('Błąd podczas pobierania wydarzeń', error);
      }
    );
  }

  

  openAddEventDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '300px',
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvents();
      }
    });
  }
  
  


}