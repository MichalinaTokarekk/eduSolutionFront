import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AnswerService } from '../answer-service/answer.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AFileService } from 'src/app/aFile/aFile-service/aFile.service';
import { HomeworkTestService } from 'src/app/homeworkTest/homeworkTest-service/homeworkTest.service';
import { HTFileService } from 'src/app/htFile/htFile-service/htFile.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';

@Component({
  selector: 'app-answer-detail',
  template: `
  <div class="answer-detail-container">
    <h2>Odpowiedź: <p>{{ data.answer.user.firstName }} {{data.answer.user.lastName }} </p></h2>
    <!-- <p>{{ data.answer.answerContent }}</p> -->
    <div class="answer-content">
      {{ data.answer.answerContent }}
    </div>
     <!-- Wyświetlanie plików do odpowiedzi -->
    <div *ngFor="let aFile of aFilesByAnswer" (click)="loadAFilesByAnswerId(data.answer.id)">
      <a (click)="downloadFileById(aFile.id)" href="javascript:void(0);">{{ aFile.name }}</a>
    </div>
    <input [(ngModel)]="editedComment" name="editedComment" placeholder="Edytuj komentarz">
    <input [(ngModel)]="editedAnswerStatus" name="editedAnswerStatus" placeholder="Edytuj status odpowiedzi">
    <button (click)="updateAnswerDetails()">Zapisz zmiany</button>   
  </div>
  `,
  styles: [`
  .answer-content {
  font-size: 18px; /* Rozmiar czcionki */
  padding: 10px; /* Wewnętrzne wypełnienie */
  border: 1px solid #ccc; /* Obramowanie */
  max-width: 100%; /* Maksymalna szerokość */
  height: 200px; /* Wysokość obszaru tekstowego */
  overflow-y: scroll; /* Pasek przewijania, jeśli tekst jest dłuższy niż obszar */
}

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
    max-width: 346px; /* ograniczenie maksymalnej szerokości inputów */
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
      // @Input() aFilesByAnswer!: any[];
      editedComment: string;
      editedAnswerStatus: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AnswerDetailComponent>, private answerService: AnswerService, private router: Router,
                        private route: ActivatedRoute, private aFileService: AFileService, private homeworkTestService: HomeworkTestService, private htFileService: HTFileService,
                        private loginService: LoginService) {
        this.editedComment = data.answer.comment;
        this.editedAnswerStatus = data.answer.answerStatus;
        console.log(data.answer.id);
        this.loadAFilesByAnswerId(data.answer.id);
    }
    homeworkTest: any = {};
    htFiles!: any[]; 
    answer!: any; 

    ngOnInit(): void {
        // this.updateAnswerDetails();
    }

    aFilesByAnswer!: any;
    loadAFilesByAnswerId(answerId: string): void {
      this.aFileService.aFilesByAnswerId(answerId).subscribe(aFiles => {
          this.aFilesByAnswer = aFiles;
        });
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
      
    downloadFileById(fileId: number): void {
      this.aFileService.downloadFileById(fileId).subscribe((blob: Blob) => {
        // Tworzymy link do pobierania pliku
  
      
        const contentType  = blob.type;
      
        let fileName = `${fileId}.pdf`;
    
        if (contentType) {
          // Sprawdzenie, czy Content-Type wskazuje na plik PDF
          if (contentType === 'application/pdf') {
            fileName = `${fileId}.pdf`;
          } else if (contentType === 'image/png') {
            // Jeśli to obraz PNG, nadaj rozszerzenie .png
            fileName = `${fileId}.png`;
          } else {
            // Obsłuż inne typy plików i nadaj odpowiednie rozszerzenia
            // np. contentType === 'image/jpeg' dla obrazów JPEG
          }
        }
  
  
        const url = window.URL.createObjectURL(blob);
    
        // Tworzymy element <a> i nadajemy mu atrybuty, aby otworzyć pobrany plik w nowej karcie
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = fileName; // Zmień nazwę pliku na coś sensownego lub korzystając z informacji o pliku
    
        // Klikamy na ten element, aby rozpocząć pobieranie pliku
        a.click();
    
        // Po pobraniu pliku usuwamy link i element <a>
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, error => {
        console.error('Błąd podczas pobierania pliku', error);
      });
    }
    
}

