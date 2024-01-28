import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { MatSnackBar } from '@angular/material/snack-bar';

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
  <h3 class="add-grade-heading">Dodaj ocenę końcową dla {{ studentFirstName }} {{ studentLastName }}</h3>
  <div class="grade-input">
  <div class="input-field">
    <input class="value-input" [(ngModel)]="newValue" name="newValue" type="number" placeholder="Wartość oceny" required>
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
  background-color: #ffffff;
  border-radius: 5px;
  height: 120px;
  width: 400px;
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
  width: 505px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  margin-left: -100px;
}

/* Styl dla przycisku Dodaj ocenę */
.add-button {
  background-color: #0056b3;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: -280px;
}

.add-button:hover {
  background-color: #0056b3;
}



`]
})

    export class AddFinalGradeDetailComponent implements OnInit{
        selectedStudent!: User;
        newValue!: number;
        newDescription!: string;
        selectedKnowledge: TypeOfTestingKnowledge[] = [];
        allStudents: User[] = [];
        allKnowledge: TypeOfTestingKnowledge[] = [];
        studentFirstName: any;
        studentLastName: any;
        existingGrade!: number; 
        isEditing: boolean = false;



    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddFinalGradeDetailComponent>, private router: Router,
                        private route: ActivatedRoute, private gradeService: GradeService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService, private typeOfTestingKnowledgeService: TypeOfTestingKnowledgeService, private snackBar: MatSnackBar, private dialog: MatDialog) {


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
          if (this.newValue > 0 && this.newValue < 7) {
          const token = this.loginService.getToken();
          const _token = token.split('.')[1];
          const _atobData = atob(_token);
          const _finalData = JSON.parse(_atobData);
    
          const newGrade = {
            value: this.newValue,
            student: this.data.studentId,
            teacher: _finalData.id,
            classGroup: this.data.courseId, // Dostosuj do swoich potrzeb
          };
          console.log('student', this.data.studentId);
          console.log('student', this.data.courseId);
    
          // Wywołanie usługi do zapisu nowej oceny
        //   this.gradeService.addFinalGrade(newGrade).subscribe((createdGrade) => {
        //     console.log('Nowa ocena została dodana:', createdGrade);
        //     this.dialogRef.close('saved');
        //   });

  
        this.gradeService.addFinalGrade(newGrade).subscribe(
            () => {
                console.log('Nowa ocena została dodana');
                this.dialogRef.close('saved');
                location.reload();
            },
          error => {
            let errorMessage = 'Nie można dodać drugiej oceny końcowej';
            if (error && error.error) {
              errorMessage = error.error;
            }
            this.openSnackBar(errorMessage, 'Error');
          }
        );
        this.isEditing = true;
      } else {
        // Wyświetl Snackbar z błędem
        this.openSnackBar('Wartość musi być większa niż 0 i mniejsza niż 7', 'Error');
    }
          
          
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 5000, // Czas wyświetlania powiadomienia (w milisekundach)
        });
    }  
      

}

