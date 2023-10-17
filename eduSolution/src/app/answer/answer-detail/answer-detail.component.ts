import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerService } from '../answer-service/answer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-answer-detail',
  template: `
  <div class="answer-detail-container">
    <h2>Odpowiedź: <p>{{ data.answer.user.firstName }} {{data.answer.user.lastName }} </p></h2>
    <p>{{ data.answer.answerContent }}</p>
    <input [(ngModel)]="editedComment" name="editedComment" placeholder="Edytuj komentarz">
    <input [(ngModel)]="editedAnswerStatus" name="editedAnswerStatus" placeholder="Edytuj status odpowiedzi">
    <button (click)="updateAnswerDetails()">Zapisz zmiany</button>
  </div>
  `,
  styles: [`
  .answer-detail-container {
    padding: 20px; /* Dodanie wewnętrznych marginesów dla kontenera */
  }
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  p {
    font-size: 18px;
  }
  input {
    width: 100%;
    padding: 5px;
    margin: 5px 0; /* zmniejszenie marginesu od góry i dołu */
    max-width: 300px; /* ograniczenie maksymalnej szerokości inputów */
  }
  button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
`]
})
    export class AnswerDetailComponent implements OnInit{
        editedComment: string;
        editedAnswerStatus: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AnswerDetailComponent>, private answerService: AnswerService, private router: Router,
                        private activatedRoute: ActivatedRoute) {
        this.editedComment = data.answer.comment;
        this.editedAnswerStatus = data.answer.answerStatus;
    }


    ngOnInit(): void {
        // this.updateAnswerDetails();
    }

    updateAnswerDetails() {
      this.data.answer.comment = this.editedComment;
      this.data.answer.answerStatus = this.editedAnswerStatus;
     
        this.answerService.updateAnswer(this.data.answer).subscribe(updatedAnswer => {
            console.log('Odpowiedź została zaktualizowana.');
            console.log('editedComment:', this.editedComment);
            console.log('editedAnswerStatus:', this.editedAnswerStatus);
          }, error => {
            console.error('Błąd podczas aktualizacji odpowiedzi:', error);
          });
          location.reload();

          
    }
      

}

