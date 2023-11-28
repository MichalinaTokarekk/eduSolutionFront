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
import { LessonScheduleService } from '../lessonsSchedule/lessonsSchedule-service/lessonsSchedule.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { Lesson } from 'src/app/interfaces/lesson-interface';


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


  constructor(private eventService: EventsScheduleService, private dialog: MatDialog, private courseService: CourseService, 
    private lessonsScheduleService: LessonScheduleService, private loginService: LoginService) {}

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
        console.log('eventy', events);
        this.loadLesson(mappedEvents);
  
        this.calendarOptions.events = mappedEvents;
      },
      (error) => {
        console.error('Błąd podczas pobierania wydarzeń', error);
      }
    );
    
  }

  loadLesson(existingEvents: any[]) {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);
  
    this.lessonsScheduleService.findLessonsForUserInClassGroups(_finalData.id).subscribe(
      (lessons: Lesson[]) => {
        const mappedEvents = lessons.flatMap((lesson) => {
          if (lesson && lesson.dates && lesson.dates.length > 0) {
            return lesson.dates.map((date) => {
              return {
                title: lesson.name,
                start: date,
              };
            });
          } else {
            console.error('Brak dat dla lekcji lub lekcja jest niezdefiniowana:', lesson);
            return [];
          }
        });
  
        const allEvents = existingEvents.concat(mappedEvents);
        this.calendarOptions.events = allEvents;
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



   // const token = this.loginService.getToken();
    // const _token = token.split('.')[1];
    // const _atobData = atob(_token);
    // const _finalData = JSON.parse(_atobData); 


    // this.lessonsScheduleService.findLessonsForUserInClassGroups(_finalData.id).subscribe(
    //   (lessons: Lesson[]) => {
    //     const mappedLessons = lessons.flatMap((lesson) => {
    //       if (lesson && lesson.dates && lesson.dates.length > 0) {
    //         return lesson.dates.map((date) => {
    //           return {
    //             title: lesson.name,
    //             start: date
    //           };
    //         });
    //       } else {
    //         console.error('Brak dat dla lekcji lub lekcja jest niezdefiniowana:', lesson);
    //         return [];
    //       }
    //     });
    
    //     this.calendarOptions.events = mappedLessons;
    //   },
    //   (error) => {
    //     console.error('Błąd podczas pobierania wydarzeń', error);
    //   }
    // );
  
  


}