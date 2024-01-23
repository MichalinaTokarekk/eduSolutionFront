import { Component } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
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
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { Time } from '@angular/common';



@Component({
  selector: 'app-root',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent {
  calendarOptions: CalendarOptions = {
    eventClick: (eventClickArg: EventClickArg) => {
      const eventId = eventClickArg.event.id;
      this.handleEventClick(eventId);
    },
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale: 'pl', 
    events: [],
     headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay', // Dodaj widoki tygodniowy dzienny i miesięczny
    },
  };


  constructor(private eventService: EventsScheduleService, private dialog: MatDialog, private courseService: CourseService, 
    private lessonsScheduleService: LessonScheduleService, private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.loadEvent();
  }

  // handleEventClick(eventId: any) {
  //   // Sprawdź, czy kliknięto w nazwę zdarzenia
  //   console.log('eventId:::', eventId);
  //   this.router.navigate(['/eventDetailPage/', eventId]);
  // }

  // handleEventClick(eventId: any) {
  //   // Sprawdź, czy kliknięto w nazwę zdarzenia
  //   console.log('eventId:::', eventId);
  
  //   // Pobierz kliknięty event na podstawie jego ID
  //   const clickedEvent = (this.calendarOptions.events as any).find((event: any) => event.id.toString() === eventId.toString());
  
  //   // Loguj strukturę klikniętego eventu
  //   console.log('clickedEvent:', clickedEvent);
  
  //   // Sprawdź, czy to jest event
  //   if (clickedEvent && clickedEvent.extendedProps && clickedEvent.extendedProps.type === 'event') {
  //     // Jeśli to jest event, przekieruj do szczegółów wydarzenia
  //     this.router.navigate(['/eventDetailPage/', eventId]);
  //   } else {
  //     console.log('To nie jest event lub event jest undefined.');
  //     // Możesz obsłużyć inny przypadek, na przykład, jeśli kliknięto lekcję lub coś innego
  //   }
  // }

  handleEventClick(eventId: any) {
    // Sprawdź, czy kliknięto w nazwę zdarzenia
    console.log('eventId:::', eventId);
  
    // Pobierz kliknięty event na podstawie jego ID
    const clickedEvent = (this.calendarOptions.events as any).find((event: any) => {
      return event.id && event.id.toString() === eventId.toString();
    });
  
    // Loguj strukturę klikniętego eventu
    console.log('clickedEvent:', clickedEvent);
  
    // Sprawdź, czy to jest event
    if (clickedEvent && clickedEvent.extendedProps && clickedEvent.extendedProps.type === 'event') {
      // Jeśli to jest event, przekieruj do szczegółów wydarzenia
      this.router.navigate(['/eventDetailPage/', eventId]);
    } else {
      console.log('To nie jest event lub event jest undefined.');
      // Możesz obsłużyć inny przypadek, na przykład, jeśli kliknięto lekcję lub coś innego
    }
  }
  
  
  
  
  
  
  
  
  

  loadEvent() {
    this.eventService.getAll().subscribe(
      (events) => {
        // Mapowanie pól z backendu na oczekiwane przez FullCalendar
        const mappedEvents = events.map((event: {id: any; name: any; eventDate: any; startEventTime: Time, endEventTime: Time}) => {
          // Przekształć datę do formatu FullCalendar
          // const startDateTime = new Date(event.eventDate);
          const startDateTime = new Date(`${event.eventDate} ${event.startEventTime}`);
          const endDateTime = new Date(`${event.eventDate} ${event.endEventTime}`);

          const eventType = 'event';
  
          return {
            id: event.id,
            title: event.name,
            start: startDateTime,
            end: endDateTime,
            // start: startDateTime,
            extendedProps: { type: eventType },
          };
        });
  
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
              // Przekształć daty i godziny do obiektu Date
              const lessonStartDate = new Date(`${date}T${lesson.startLessonTime}`);
              const lessonEndDate = new Date(`${date}T${lesson.endLessonTime}`);
              
              return {
                title: lesson.name,
                start: lessonStartDate,
                end: lessonEndDate,
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
      width: '350px',
      height: '560px',
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEvent();
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
  
    actions(){
      if(this.loginService.getToken()!=''){
        let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
        if(_currentRole=='admin' ||  _currentRole=='teacher' || _currentRole=='user'){
          return true;
        }
      }
      return false
    }
  
  actionsTeachacher(){
    if(this.loginService.getToken()!=''){
      let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
      if(_currentRole=='admin' || _currentRole == 'teacher'){
        return true;
      }
    }
    return false
  }


}