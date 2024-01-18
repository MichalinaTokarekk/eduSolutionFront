import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CourseService } from 'src/app/course/course-service/course.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsScheduleService } from '../eventsSchedule-service/eventsSchedule.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';



@Component({
  selector: 'app-root',
  templateUrl: './eventDetailPage.component.html',
  styleUrls: ['./eventDetailPage.component.css']
})
export class EventDetailPageComponent {
  constructor(private eventService: EventsScheduleService, private dialog: MatDialog, private courseService: CourseService, 
    private loginService: LoginService, private router: Router, private route: ActivatedRoute, private classsGroupService: ClassGroupService, private location: Location) {}

    originalClassGroups: any[] = [];

    ngOnInit() {
        this.loadEvents();
        this.loadEvent();
        this.originalClassGroups = [...this.allClassGroups];
    }
  
  
  
    eventId!: string;
    selectedEventName: string = '';
    selectedEventDate: string = '';
    selectedClassGroups: any[] = [];
    allClassGroups: any[] = [];
    
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
            this.selectedClassGroups = res.classGroups;
        });      
    });

    }

    loadEvent() {
      this.classsGroupService.getAll().subscribe(
        (events) => {
          this.originalClassGroups = events;
          this.allClassGroups = [...this.originalClassGroups];
        },
        (error) => {
          console.error('Błąd podczas pobierania wydarzeń', error);
        }
      );
      
      
    }

    isSelected(group: any): boolean {
      return this.selectedClassGroups.some(selectedGroup => selectedGroup.id === group.id);
    }
    
    onGroupSelectionChange(group: any): void {
      const isSelected = this.isSelected(group);
    
      if (isSelected) {
        // Usuń grupę, jeśli była zaznaczona i została odznaczona
        this.selectedClassGroups = this.selectedClassGroups.filter(selectedGroup => selectedGroup.id !== group.id);
      } else {
        // Dodaj grupę, jeśli była niezaznaczona i została zaznaczona
        this.selectedClassGroups.push(group);
      }
    }

    compareFn(group1: any, group2: any): boolean {
      return group1 && group2 ? group1.id === group2.id : group1 === group2;
    }
    
    


    editEvent() {
        const updatedEventData = {
          id: this.eventId,
          name: this.selectedEventName,
          eventDate: this.selectedEventDate,
          classGroups: this.selectedClassGroups
        };
      
        this.eventService.update(updatedEventData).subscribe(
          (result: any) => {
            console.log('Event updated successfully:', result);
            console.log('id:', this.eventId);
          },
          (error: any) => {
            console.error('Error updating event:', error);
          }
        );
      
        console.log('edit', this.eventId);
      }
      
    
      deleteEvent() {
        this.eventService.remove(this.eventId).subscribe((result: any) => {
          console.log('Event deleted successfully:', result);
          this.router.navigate(['/calendar-view']);
        });
      }
  
  

    isEditMode: boolean = false;

  startEdit() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  saveChanges() {
    // Tutaj możesz dodać logikę zapisywania zmian
    // Na przykład, wywołaj funkcję editEvent()
    this.editEvent();

    // Po zapisaniu zmian, wyłącz tryb edycji
    this.isEditMode = false;
  }

  filteredClassGroups: any[] = [];

  onSearchChange(event: any): void {
    const searchValue = event?.target?.value || '';
    this.allClassGroups = this.originalClassGroups.filter(classGroup => {
      const name = classGroup.name.toLowerCase();
      return name.startsWith(searchValue.toLowerCase());
    });
  }

  goBack() {
    this.location.back();
  }
  
  
  

}