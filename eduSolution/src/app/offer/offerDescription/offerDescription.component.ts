// Importy...
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';
import { LessonScheduleService } from 'src/app/schedule/lessonsSchedule/lessonsSchedule-service/lessonsSchedule.service';

@Component({
  selector: 'app-offer-description',
  templateUrl: './offerDescription.component.html',
  styleUrls: ['./offerDescription.component.css']
})
export class OfferDescriptionComponent implements OnInit {
  classGroupId: number | undefined;
  classGroup: any; // Tu możesz przechowywać dane klasy
  lessons!: any[];
  classGroupName: any;

  constructor(private route: ActivatedRoute, private classGroupService: ClassGroupService, private location: Location, private lessonService: LessonScheduleService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.classGroupId = params['classGroupId'];
      
        if (this.classGroupId !== undefined) {
          // Konwersja na string
          const classGroupIdString: string = this.classGroupId.toString();
      
          this.classGroupService.get(classGroupIdString).subscribe(
            (classGroupData) => {
              this.classGroup = classGroupData;
              this.classGroupName = this.classGroup.name;


              this.lessonService.findLessonsByClassGroupId(classGroupIdString).subscribe(
                (data) => {
                  this.lessons = data;
                  console.log('lessons', this.lessons);
                }
              )

            },
            (error) => {
              console.error('Błąd podczas pobierania danych klasy:', error);
            }
          );
        } else {
          console.error('Nieprawidłowy identyfikator klasy.');
        }
      });
  }

  
  goBack() {
    this.location.back();
  }

}
