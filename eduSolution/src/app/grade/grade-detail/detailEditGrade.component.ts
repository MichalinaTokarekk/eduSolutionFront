import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AFileService } from 'src/app/aFile/aFile-service/aFile.service';
import { HomeworkTestService } from 'src/app/homeworkTest/homeworkTest-service/homeworkTest.service';
import { HTFileService } from 'src/app/htFile/htFile-service/htFile.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { GradeService } from '../grade-service/grade.service';
import { TypeOfTestingKnowledge } from 'src/app/interfaces/typeOfTestingKnowledge-interface';
import { Grade } from 'src/app/interfaces/grade-interface';
import { TypeOfTestingKnowledgeService } from 'src/app/typeOfTestingKnowledge/typeOfTestingKnowledge-service/typeOfTestingKnowledge.service';

@Component({
  selector: 'app-answer-detail',
  template: `
    <!-- <div class="answer-detail-container">
  <h3 class="add-grade-heading">Lista ocen dla studenta: {{ studentFirstName }} {{ studentLastName }}</h3>

  <ng-container *ngFor="let grade of gradesByUser[studentId]">
    <div class="grade-item">
      <p>Wartość oceny: {{ grade.value }}</p>
      <p>Opis oceny: {{ grade.description }}</p>
      <p>Nauczyciel: {{ data.teacherFirstName }} {{ data.teacherLastName }}</p>

      <button (click)="EditGrade()">Edytuj ocenę</button>
    </div>
  </ng-container>
</div> -->

<div class="answer-detail-container">
  <h3 class="add-grade-heading">Lista ocen dla studenta: {{ studentFirstName }} {{ studentLastName }}</h3>

  <ng-container *ngFor="let grade of gradesByUser[studentId]; let i = index">
    <div class="grade-item">
      <p>
        Wartość oceny:
        <input [(ngModel)]="gradesByUser[studentId][i].value" [readonly]="!isEditing[i]" class="grade-input">
      </p>
      <p>
        Opis oceny:
        <input [(ngModel)]="gradesByUser[studentId][i].description" [readonly]="!isEditing[i]" class="grade-input">
      </p>
      <p>Nauczyciel: {{ data.teacherFirstName }} {{ data.teacherLastName }}</p>
      <p *ngIf="typeOfTestingKnowledge[i] && typeOfTestingKnowledge[i].name">Typ oceny: {{ typeOfTestingKnowledge[i].name }} </p>
      <p *ngIf="!typeOfTestingKnowledge[i]">Nie podano typu oceny</p>
      <p *ngIf="isEditing[i]">
        Typ oceny:
        <mat-select class="knowledge-select" [(ngModel)]="selectedKnowledge[i]" name="knowledge" placeholder="Wybierz rodzaj oceny">
        <mat-option *ngFor="let knowledge of allKnowledge" [value]="knowledge.id">{{ knowledge.name }}</mat-option>
      </mat-select>
        </p>

      <button *ngIf="!isEditing[i]" (click)="toggleEditing(i)" class="edit-button">Edytuj ocenę</button>
      <button *ngIf="isEditing[i]" (click)="saveEditing(i)" class="edit-button">Zapisz</button>

      <button (click)="deleteGrade(i)" class="delete-button">Usuń</button>
    </div>
  </ng-container>
</div>



  `,
  styles: [`
 .edit-button {
  background-color: #007bff; /* Kolor tła */
  color: #fff; /* Kolor tekstu */
  padding: 5px 10px; /* Wielkość przycisku */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s; /* Dla płynnej zmiany koloru tła */
  outline: none; /* Usunięcie domyślnego obramowania */
}

.edit-button:hover, .edit-button:focus {
  background-color: #0056b3; /* Kolor tła po najechaniu myszką (hover) lub uzyskaniu focusu */
}


 .answer-detail-container {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
}

.add-grade-heading {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.grade-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px 0;
  background-color: #fff;
  border-radius: 5px;
}

.grade-item p {
  margin: 5px 0;
}

/* Dodatkowy styl dla przycisku "Edytuj ocenę", który jest aktualnie wyłączony */
.grade-item button {
  background-color: #ddd;
  border: none;
  color: #333;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: not-allowed;
}

.grade-item button:hover {
  background-color: #ddd;
}

`]
})
    export class DetailEditGradeComponent implements OnInit{

    grades: Grade[] = [];    
    studentFirstName: any;
    studentLastName: any;
    teacherFirstName: any;
    teacherLastName: any;
    studentId: any;
    courseId: any;
    type!: TypeOfTestingKnowledge;
    value!: string;
    description!: string;
    typeOfTestingKnowledge: TypeOfTestingKnowledge[] = [];
    allKnowledge: TypeOfTestingKnowledge[] = [];
    selectedKnowledge: number[] = [];



    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DetailEditGradeComponent>, private router: Router,
                        private route: ActivatedRoute, private aFileService: AFileService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService, private gradeService: GradeService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService) {
        this.grades = data.grades;
        this.studentFirstName = data.studentFirstName;
        this.studentLastName = data.studentLastName;
        this.teacherFirstName = data.teacherFirstName;
        this.teacherLastName = data.teacherLastName;
        this.studentId = data.studentId;
        this.courseId = data.courseId;
        this.typeOfTestingKnowledge = data.allTypes;
        console.log('typ', this.typeOfTestingKnowledge);
}

ngOnInit(): void {
    console.log('Kliknięto przycisk Pobierz oceny.');
    this.gradeService.getGradesByStudentId(this.studentId, this.courseId).subscribe((grades) => {
        console.log('Oceny dla studentId ' + this.studentId + ':', grades);
        this.gradesByUser[this.studentId] = grades as Grade[];
        
        console.log('load', this.gradesByUser[this.studentId]);
        
    });


    this.typeOfTestingKnowledgeService.getAll().subscribe((knowledge: TypeOfTestingKnowledge[]) => {
        this.allKnowledge = knowledge;
    });
}


    gradesByUser: { [key: number]: Grade[] } = {};
    isEditing: boolean[] = [];


    toggleEditing(index: number) {
        this.isEditing[index] = !this.isEditing[index];
      }
   

    saveEditing(index: number) {
    const editedGrade = this.gradesByUser[this.studentId][index];
    if(!editedGrade.finalValue) {
        if (this.selectedKnowledge[index] !== undefined) {
            editedGrade.typeOfTestingKnowledge = this.allKnowledge.find(type => type.id === this.selectedKnowledge[index]) as TypeOfTestingKnowledge;
        }
        this.gradeService.save(editedGrade).subscribe((response) => {
            this.isEditing[index] = false; // Wyłącz edycję po zapisie
            console.log('editedGrade.isFinalValue:', editedGrade.finalValue);
        });
    }else if (editedGrade.finalValue == true) {
            this.gradeService.updateFinalGrade(editedGrade).subscribe((response) => {
                this.isEditing[index] = false; // Wyłącz edycję po zapisie
            });
        }
    

    // location.reload();
    }


    deleteGrade(index: number) {
        const gradeId = this.gradesByUser[this.studentId][index].id.toString(); // Konwersja na string
        
        this.gradeService.remove(gradeId).subscribe((response) => {
            // Obsługa odpowiedzi po usunięciu oceny
            this.gradesByUser[this.studentId].splice(index, 1); // Usuń ocenę z lokalnej tablicy
        });
        location.reload();
    }
      
}

