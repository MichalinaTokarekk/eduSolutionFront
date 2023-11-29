import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from 'src/app/course/course-service/course.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsScheduleService } from '../eventsSchedule-service/eventsSchedule.service';



@Component({
  selector: 'app-root',
  templateUrl: './eventDetailPage.component.html',
  styleUrls: ['./eventDetailPage.component.css']
})
export class EventDetailPageComponent {
  constructor(private eventService: EventsScheduleService, private dialog: MatDialog, private courseService: CourseService, 
    private loginService: LoginService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadEvents();
  }
  
  
  
  eventId!: string;
  selectedEventName: string = '';
  selectedEventDate: string = '';
 loadEvents() {
  this.route.params.subscribe(params => {
    // console.log('Odebrane parametry:', params);
    this.eventId = params['eventId'];
    console.log('Odebrany eventId:', this.eventId);
    this.eventService.get(this.eventId).subscribe((res: any) => {
        console.log('Response from eventService:', res); // Log the entire response
      
        if (res.name) {
          this.selectedEventName = res.name;
          console.log('Name', this.selectedEventName);
        } else {
          console.error('Event data not available or incomplete.');
        }
        this.selectedEventDate = res.eventDate;
      });
      
      
      
  });

}

  

}