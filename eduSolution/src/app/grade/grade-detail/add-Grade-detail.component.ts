import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AFileService } from 'src/app/aFile/aFile-service/aFile.service';
import { HomeworkTestService } from 'src/app/homeworkTest/homeworkTest-service/homeworkTest.service';
import { HTFileService } from 'src/app/htFile/htFile-service/htFile.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { Grade } from 'src/app/interfaces/grade-interface';
import { GradeService } from '../grade-service/grade.service';
import { User } from 'src/app/interfaces/user-interface';
import { Course } from 'src/app/interfaces/course-interface';
import { TypeOfTestingKnowledge } from 'src/app/interfaces/typeOfTestingKnowledge-interface';
import { TypeOfTestingKnowledgeService } from 'src/app/typeOfTestingKnowledge/typeOfTestingKnowledge-service/typeOfTestingKnowledge.service';

@Component({
  selector: 'app-answer-detail',
  template: `
    <!-- <h3>Dodaj nową ocenę:</h3>
    <div class="grade-input">
      <input [(ngModel)]="newValue" name="newValue" type="number" placeholder="Wartość oceny" required>
      <input [(ngModel)]="newDescription" name="newDescription" type="text" placeholder="Opis oceny">
      <mat-select [(ngModel)]="selectedKnowledge" name="knowledge">
        <mat-option *ngFor="let knowledge of allKnowledge" [value]="knowledge.id">{{ knowledge.name }}</mat-option>
      </mat-select>
      <button (click)="addNewGrade()">Dodaj ocenę</button>
    </div> -->

<div class="additional-block">
  <h3 class="add-grade-heading">Dodaj nową ocenę dla {{ studentFirstName }} {{ studentLastName }}</h3>
  <div class="grade-input">
    <div class="input-field">
      <input class="value-input" [(ngModel)]="newValue" name="newValue" type="number" placeholder="Wartość oceny" required>
    </div>
    <div class="input-field">
      <input class="description-input" [(ngModel)]="newDescription" name="newDescription" type="text" placeholder="Opis oceny">
    </div>
    <div class="input-field">
      <mat-select class="knowledge-select" [(ngModel)]="selectedKnowledge" name="knowledge" placeholder="Wybierz rodzaj oceny">
        <mat-option *ngFor="let knowledge of allKnowledge" [value]="knowledge.id">{{ knowledge.name }}</mat-option>
      </mat-select>
    </div>
    <button class="add-button" (click)="addNewGrade()">Dodaj ocenę</button>
  </div>
</div>

  `,
  styles: [`
  .additional-block {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  height: 300px;
  width: 460px;
}

.add-grade-heading {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
 /* Styl dla całego formularza */
.grade-input {
  text-align: center;
}

/* Styl dla nagłówka */
.add-grade-heading {
  font-size: 20px;
  margin-bottom: 10px;
}

/* Styl dla pól input */
.input-field {
  margin: 10px 0;
}

/* Styl dla pola wartości oceny */
.value-input {
  width: 455px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: -7px;
}

/* Styl dla pola opisu oceny */
.description-input {
  width: 455px;
  height: 90px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-left: -7px;
}

/* Styl dla selecta */
.knowledge-select {
  width: 455px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  margin-right: 50px;
  margin-left: -7px;
}

/* Styl dla przycisku Dodaj ocenę */
.add-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: -340px;
}

.add-button:hover {
  background-color: #0056b3;
}



`]
})

    export class AddGradeDetailComponent implements OnInit{
        selectedStudent!: User;
        newValue!: number;
        newDescription!: string;
        selectedKnowledge: TypeOfTestingKnowledge[] = [];
        allStudents: User[] = [];
        allKnowledge: TypeOfTestingKnowledge[] = [];
        studentFirstName: any;
        studentLastName: any;


    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddGradeDetailComponent>, private router: Router,
                        private route: ActivatedRoute, private gradeService: GradeService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService) {


        this.studentFirstName = data.studentFirstName;
        this.studentLastName = data.studentLastName;
        
    }
  
    ngOnInit(): void {
        // this.updateAnswerDetails();
        this.typeOfTestingKnowledgeService.getAll().subscribe((knowledge: TypeOfTestingKnowledge[]) => {
            this.allKnowledge = knowledge;
        });
    }

    

    addNewGrade(): void {
    console.log('newValue:', this.newValue);
          // Przygotowanie nowej oceny
          const token = this.loginService.getToken();
          const _token = token.split('.')[1];
          const _atobData = atob(_token);
          const _finalData = JSON.parse(_atobData);
    
          const newGrade = {
            value: this.newValue,
            description: this.newDescription,
            student: this.data.studentId,
            teacher: _finalData.id,
            typeOfTestingKnowledge: this.selectedKnowledge,
            course: this.data.courseId, // Dostosuj do swoich potrzeb
          };
          console.log('student', this.data.studentId);
          console.log('student', this.data.courseId);
    
          // Wywołanie usługi do zapisu nowej oceny
          this.gradeService.save(newGrade).subscribe((createdGrade) => {
            console.log('Nowa ocena została dodana:', createdGrade);
            this.dialogRef.close('saved');
          });
          location.reload();
      }
      

}

