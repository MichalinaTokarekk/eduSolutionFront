import { HttpClient } from '@angular/common/http';
import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationDialogSemesterComponent } from '../../confirmations/semester/confirmation-dialog-semester.component';
import { EduMaterialService } from 'src/app/eduMaterial/eduMaterial-service/eduMaterial.service';
import { Section } from 'src/app/interfaces/section-interface';
import { EduMaterial } from 'src/app/interfaces/eduMaterial-interface';
import { Subscription, catchError, of, switchMap, tap } from 'rxjs';
import { EMFile } from 'src/app/interfaces/emFile-interface';
import { EMFileService } from 'src/app/emFile/emFile-service/emFile.service';
import { HomeworkTestService } from '../homeworkTest-service/homeworkTest.service';
import { HomeworkTest } from 'src/app/interfaces/homeworkTest-interface';
import { HTFile } from 'src/app/interfaces/htFile-interface';
import { HTFileService } from 'src/app/htFile/htFile-service/htFile.service';
import { AnswerService } from 'src/app/answer/answer-service/answer.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { Answer } from 'src/app/interfaces/answer-interface';
import { AFileService } from 'src/app/aFile/aFile-service/aFile.service';
import { AFile } from 'src/app/interfaces/aFile-interface';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroup } from 'src/app/interfaces/classGroup-interface';
import { UserService } from 'src/app/user/user-service/user.service';
import { AnswerDetailComponent } from 'src/app/answer/answer-detail/answer-detail.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { Course } from 'src/app/interfaces/course-interface';
import { Location } from '@angular/common';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'homeworkTest-manage.component.html',
  styleUrls: ['homeworkTest-manage.component.css'],
})
export class HomeworkTestManage implements OnInit {
@ViewChild(AnswerDetailComponent, { static: false })
answerDetailComponent!: AnswerDetailComponent;

homeworkTest: any = {};
classGroupsByUserId: any = {};
answersByHomeworkTest: any = {};
htFileIdContainer: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, 
    private homeworkTestService: HomeworkTestService, private htFileService: HTFileService, private answerService: AnswerService, private loginService: LoginService,
    private aFileService: AFileService, private courseService: CourseService, private userService: UserService, private location: Location){
  }

htFilesByHomeworkTest!: Array<any>;

htFiles!: any[]; 
aFiles!: any[]; 
course!: any; 
answer!: any; 
answerId!: any; 
userRole!: string;
private classGroupId!: number;
homeworkTestId!: string;
ngOnInit(): void {
    // Pobierz ID materiału edukacyjnego z parametrów routingu
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id !== null) {
        this.homeworkTestId = id;
        // Użyj usługi do pobrania materiału edukacyjnego na podstawie ID
        this.homeworkTestService.get(id).subscribe((homeworkTest: any) => {
          // Zapisz materiał edukacyjny w komponencie
          this.homeworkTest = homeworkTest;
  
          // Pobierz pliki materiałów edukacyjnych po ID materiału edukacyjnego
          this.htFileService.htFilesByHomeworkTestsId(homeworkTest.id).subscribe((htFiles: any) => {
            this.htFiles = htFiles;
          }, error => {
            console.error(error);
          });


        const token = this.loginService.getToken();
        const _token = token.split('.')[1];
        const _atobData = atob(_token);
        const _finalData = JSON.parse(_atobData);

          this.answerService.getAnswerByHomeworkTestIdAndUserId(homeworkTest.id, _finalData.id).subscribe((answer: any) => {
            this.answer = answer;

            if(answer) {
            this.loadAFilesByAnswerId(answer.id);
            }
          }, error => {
            console.error(error);
          });

        }, error => {
          console.error(error);
        });
      } else {
        console.log("Nie ma nic");
      }
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
        const id = params.get('id');
        if (id !== null) {
          this.homeworkTestService.get(id).subscribe((homeworkTest: any) => {
            this.homeworkTest = homeworkTest;
      
          }, error => {
            console.error(error);
          });
        } else {
          console.log("Nie ma nic");
        }
      });

      const token = this.loginService.getToken();
      const _token = token.split('.')[1];
      const _atobData = atob(_token);
      const _finalData = JSON.parse(_atobData);


    this.userRole = _finalData.role;


    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id !== null) {
        this.homeworkTestService.get(id).subscribe((homeworkTest: any) => {
          this.homeworkTest = homeworkTest;
          this.classGroupId = homeworkTest.section.classGroup.id; // Przypisz courseId
          console.log('classGroupId', this.classGroupId);
          this.findUsersByClassGroupId();

        }, error => {
          console.error(error);
        });
      } else {
        console.log("Nie ma nic");
      }
    });
    
    // this.findByHomeworkTest();

     if (this.homeworkTest && this.homeworkTestId) {
      console.log('homeworkTest.id:', this.homeworkTestId);
    } else {
      console.error('Błąd: this.homeworkTest jest niezdefiniowane lub nie ma właściwości "id".');
    }
    
  }



  usersByClassGroup: any[] = [];
  findUsersByClassGroupId(): void {
    console.log('Przed wywołaniem findUsersByClassGroupId');
    this.userService.findUsersByClassGroupId(this.classGroupId).subscribe(
      users => {
        console.log('Odpowiedź z serwera:', users);
        this.usersByClassGroup = users;
        console.log('Użytkownicy przypisani do klasy:', this.usersByClassGroup);
      },
      error => {
        console.error('Błąd podczas pobierania użytkowników:', error);
      }
    );
    console.log('Po wywołaniu findUsersByClassGroupId');
  }
  
  
  
  // findByHomeworkTest(): void {
  //   this.answerService.findByHomeworkTest(this.homeworkTest.id).subscribe(answersByHomeworkTest => {
  //     this.answersByHomeworkTest = answersByHomeworkTest;
  //     console.log('odpowiedzi ', this.answersByHomeworkTest);
  //   }, error => {
  //     console.error('Błąd podczas pobierania klas użytkownika:', error);
  //     console.log('homeworkTestId', this.homeworkTest.id);
  //   });
  // }

  // openAnswerDetailsDialog(answer: Answer): void {
  //   const dialogRef = this.dialog.open(AnswerDetailComponent, {
  //     width: '400px', 
  //     data: { answer, aFilesByAnswer: this.aFilesByAnswer, homeworkTest: this.homeworkTest, courseId: this.classGroupId}, 
  //   });
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result === 'saved') {
  //       this.answerDetailComponent.updateAnswerDetails();
  //     }
  //   });
  // }

selectedUser: any | null = null;

openAnswerDetailsDialog(user: any, homeworkTest: any): void {
  if (homeworkTest && homeworkTest.id) {
    const classGroupId = homeworkTest.section.classGroup.id;
    console.log('Hejo');
  // Poniższy kod będzie wykonany tylko wtedy, gdy this.homeworkTest jest zdefiniowane i ma właściwość 'id'
  this.answerService.getAnswerByHomeworkTestIdAndUserId(this.homeworkTestId, user.id).subscribe(answer => {
    const emptyAnswer = {
      id: null,
      userId: null,
      homeworkTestId: null,
      comment: '',
      answerStatus: ''
      // inne pola, które chcesz mieć puste
    };
    const dialogRef = this.dialog.open(AnswerDetailComponent, {
      width: '400px',
      data: { user: user, answer: answer || emptyAnswer, homeworkTest: homeworkTest, classGroupId: classGroupId}
    });
    console.log('homework', this.homeworkTestId);

    dialogRef.afterClosed().subscribe(result => {
      console.log('Okno zamknięte');
      this.selectedUser = null; // Resetuj wybranego użytkownika po zamknięciu okna dialogowego
    });
  });
} else if (!(homeworkTest && homeworkTest.id) && !this.answerService.getAnswerByHomeworkTestIdAndUserId(homeworkTest.id, user.id)) {
  console.log('Showing snackbar');
  this.openSnackBarAnswer('Brak odpowiedzi dla tego użytkownika i zadania.');
  return;
}

else {
  console.error('Błąd: this.homeworkTest jest niezdefiniowane lub nie ma właściwości "id".');
}
}


  

  aFilesByAnswer!: any;
  loadAFilesByAnswerId(answerId: string): void {
    this.aFileService.aFilesByAnswerId(answerId).subscribe(aFiles => {
        this.aFilesByAnswer = aFiles;
      });
  }

  

  loadHTFilesByHomeworkTestId(eduMaterialId: string): void {
    // this.emFileService.emFilesByEduMaterialId(eduMaterialId).subscribe(sections => {
    //   this.emFilesByEduMaterial = sections;
    // });

    this.route.paramMap.subscribe((params: ParamMap) => {
        const id = params.get('id');
        if (id !== null) {
            
        }
    });
  }

  isEdit: boolean = false;

  submitForm() {
    // Wywołaj usługę, aby zapisać materiał edukacyjny
    this.homeworkTestService.save(this.homeworkTest).subscribe(
      (savedHomeworkTests: HomeworkTest) => {
        console.log('Zapisano zmiany:', savedHomeworkTests);
        // Możesz dodać obsługę sukcesu tutaj
        this.homeworkTest.isEdit = false;
      },
      (error) => {
        console.error('Błąd podczas zapisywania zmian:', error);
        // Obsłuż błąd, jeśli wystąpi
      }
      
    );

    
  }

  currentEditingSection: any;
  onEdit(section: any) {
    // Zapisz aktualnie edytowaną sekcję
    this.currentEditingSection = section;
  
    // Ustaw flagę isEdit na true dla wybranej sekcji
    section.isEdit = true;
  }



isAnswerContentVisible: boolean = false;
isEditing: boolean = false;
currentEditingAnswer: any;
  onEditAnswer(answer: any) {
    this.isAnswerContentVisible = true;
}

  notOnEdit(section: any) {
    // Zapisz aktualnie edytowaną sekcję
    this.currentEditingSection = section;
  
    // Ustaw flagę isEdit na true dla wybranej sekcji
    section.isEdit = false;
  }



eduMaterialEMFiles: any[] = [];
  // emFileId!: number;

onAddFile(homeworkTest: any) {
  this.route.paramMap.subscribe((params: ParamMap) => {
    const id = params.get('id');
    if (id !== null) {
        
  
  const htFile: HTFile = {
    id: id, // Jeśli ID jest automatycznie generowane przez serwer, pozostaw to jako 0
    homeworkTest: homeworkTest, 
    // name: this.fileToUpload.name, 
    // type: this.fileToUpload.type,
    // fileData: new Uint8Array(0) 
  };
  
    if (this.fileToUpload) {
      this.htFileService.uploadFile(this.fileToUpload, id).subscribe(
        (response: string) => {
          console.log("Plik został przesłany:", response);
          const responseData = JSON.parse(response);
          
      
          
        },
        (uploadError) => {
          // console.error("Błąd podczas przesyłania pliku:", uploadError);
          console.log("fileToUpload:", this.fileToUpload);
          console.log("id:", id);
          location.reload();
        }
      );
    
    }
    
    else {
      console.log("Nie wybrano pliku.");
    }
  }
});
  }

  onDeleteEMFile(obj: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.htFileService.remove(obj.id).subscribe(
          response => {
            this.openSnackBar('Pole usunięte pomyślnie', 'Success');
          },
          error => {
            let errorMessage = 'An error occurred';
            if (error && error.error) {
              errorMessage = error.error;
            }
            this.openSnackBar(errorMessage, 'Error');
          }
        );
      }
    });
    
  }
    
  
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 5000, // Czas wyświetlania powiadomienia (w milisekundach)
      });
    }

    openSnackBarAnswer(message: string): void {
      console.log('Snackbar message:', message);
      this.snackBar.open(message, 'Close', { duration: 3000 });
    }
    
  



  fileToUpload!: File;



  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileToUpload = inputElement.files[0];
    }
  }
  
downloadFileById(fileId: number): void {
    this.htFileService.downloadFileById(fileId).subscribe((blob: Blob) => {
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

  
  newAnswerContent: string = '';
  onSaveAnswer() {
    this.route.paramMap.subscribe((params: ParamMap) => {
        const id = params.get('id');
        if (id !== null) {
          // Użyj usługi do pobrania materiału edukacyjnego na podstawie ID
          this.homeworkTestService.get(id).subscribe((homeworkTest: any) => {
            // Zapisz materiał edukacyjny w komponencie
            this.homeworkTest = homeworkTest;
  
          const token = this.loginService.getToken();
          const _token = token.split('.')[1];
          const _atobData = atob(_token);
          const _finalData = JSON.parse(_atobData);

          
        const answer: Answer = {
            id: 0,
            answerContent: this.newAnswerContent,
            homeworkTest: homeworkTest,
            user: _finalData.id,
            // answerStatus: this.answer.answerStatus
        };
        
          this.answerService.save(answer).subscribe(savedAnswer => {
            // Tutaj możesz dodać odpowiednie akcje po zapisaniu odpowiedzi, np. powiadomienie o sukcesie.
            console.log('Odpowiedź została zapisana.');
            
            // Następnie zresetuj newAnswerContent
            this.newAnswerContent = '';
            this.isEditing = false;
            this.isAnswerContentVisible = false;

            location.reload();
          }, error => {
            console.error('Błąd podczas zapisywania odpowiedzi:', error);
          });


          }, error => {
            console.error(error);
          });
        } 
      });
  }



  onUpdateAnswer() {
    this.answerService.save(this.answer).subscribe(updatedAnswer => {
      // Tutaj możesz dodać odpowiednie akcje po zaktualizowaniu odpowiedzi, np. powiadomienie o sukcesie.
      console.log('Odpowiedź została zaktualizowana.');
      this.isEditing = false;
      this.isAnswerContentVisible = false;
     

    }, error => {
      console.error('Błąd podczas aktualizacji odpowiedzi:', error);
    });
  }

  
  
  
  onDeleteAnswer(obj: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.answerService.remove(obj.id).subscribe(
          response => {
            this.openSnackBar('Pole usunięte pomyślnie', 'Success');
            location.reload();
          },
          error => {
            let errorMessage = 'An error occurred';
            if (error && error.error) {
              errorMessage = error.error;
            }
            this.openSnackBar(errorMessage, 'Error');
          }
        );
      }
    });  
  }

  onDeleteAFile(obj: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);
  
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.aFileService.remove(obj.id).subscribe(
          response => {
            this.openSnackBar('Pole usunięte pomyślnie', 'Success');
            location.reload();
          },
          error => {
            let errorMessage = 'An error occurred';
            if (error && error.error) {
              errorMessage = error.error;
            }
            this.openSnackBar(errorMessage, 'Error');
          }
        );
      }
    });
    
  }


  aFileToUpload!: File;



  onAFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.aFileToUpload = inputElement.files[0];
    }
  }

  onAddAFile(answer: any) {
      if (this.aFileToUpload) {
        this.aFileService.uploadFile(this.aFileToUpload, answer.id).subscribe(
          (response: string) => {
            console.log("Plik został przesłany:", response);
            const responseData = JSON.parse(response);
            this.handleFileUploadComplete(responseData, answer);
        
            
          },
          (uploadError) => {
            // console.error("Błąd podczas przesyłania pliku:", uploadError);
            console.log("aFileToUpload:", this.aFileToUpload);
            // console.log("answerId:", answer.id);
            location.reload();
          }
        );
      
      }
      
      else {
        console.log("Nie wybrano pliku.");
      }
    }

    handleFileUploadComplete(responseData: any, answer: any) {
        console.log("Przesyłanie pliku zakończone.");
        // Tutaj możesz wykonać dodatkowe akcje, które chcesz po zakończeniu przesyłania pliku
        location.reload();
    }


  calculateDaysUntilDeadline(): { days: number, hours: number, minutes: number, overdue: boolean, daysBeforeDeadline: number } {
    const currentDate = new Date();
    let deadlineDate: Date;
    let updatedAtDate: Date;
  
    if (this.homeworkTest.deadline instanceof Date) {
      deadlineDate = this.homeworkTest.deadline;
    } else if (typeof this.homeworkTest.deadline === 'string') {
      deadlineDate = new Date(this.homeworkTest.deadline);
  
      if (isNaN(deadlineDate.getTime())) {
        return { days: 0, hours: 0, minutes: 0, overdue: false, daysBeforeDeadline: 0 };
      }
    } else {
      return { days: 0, hours: 0, minutes: 0, overdue: false, daysBeforeDeadline: 0 };
    }
  
    if (this.homeworkTest.updatedAt instanceof Date) {
      updatedAtDate = this.homeworkTest.updatedAt;
    } else if (typeof this.homeworkTest.updatedAt === 'string') {
      updatedAtDate = new Date(this.homeworkTest.updatedAt);
  
      if (isNaN(updatedAtDate.getTime())) {
        return { days: 0, hours: 0, minutes: 0, overdue: false, daysBeforeDeadline: 0 };
      }
    } else {
      return { days: 0, hours: 0, minutes: 0, overdue: false, daysBeforeDeadline: 0 };
    }
  
    const timeDifference = deadlineDate.getTime() - currentDate.getTime();
    const totalMinutesRemaining = Math.floor(timeDifference / (1000 * 60));
    const overdue = totalMinutesRemaining < 0;
  
    const daysRemaining = Math.floor(Math.abs(totalMinutesRemaining) / (24 * 60));
    const hoursRemaining = Math.floor((Math.abs(totalMinutesRemaining) % (24 * 60)) / 60);
    const minutesRemaining = Math.abs(totalMinutesRemaining) % 60;
  
    const timeDifferenceBeforeDeadline = deadlineDate.getTime() - updatedAtDate.getTime();
    const daysBeforeDeadline = Math.floor(timeDifferenceBeforeDeadline / (1000 * 3600 * 24));
  
    return { days: daysRemaining, hours: hoursRemaining, minutes: minutesRemaining, overdue, daysBeforeDeadline };
  }

  

  
  calculateTimeDifference(): { days: number, hours: number, minutes: number, beforeDeadline: boolean } {
    const updatedAtDate = new Date(this.answer.updatedAt);
    const deadlineDate = new Date(this.homeworkTest.deadline);
    
    const timeDifference = deadlineDate.getTime() - updatedAtDate.getTime();
    const beforeDeadline = timeDifference > 0;
  
    const totalMinutesDifference = Math.abs(Math.floor(timeDifference / (1000 * 60)));
    const daysDifference = Math.floor(totalMinutesDifference / (24 * 60));
    const hoursDifference = Math.floor((totalMinutesDifference % (24 * 60)) / 60);
    const minutesDifference = totalMinutesDifference % 60;
  
    return { days: daysDifference, hours: hoursDifference, minutes: minutesDifference, beforeDeadline };
  }
  
  

  
  isEditingDate = false;
  editedDeadline!: Date;

  saveEditedDeadline() {
    if (!this.homeworkTest || !this.editedDeadline) {
      return;
    }
  
    // Tworzy obiekt z zaktualizowanym terminem oddania
    const updatedHomeworkTest = {
      id: this.homeworkTest.id,
      deadline: this.editedDeadline,
      name: this.homeworkTest.name // Zachowuje nazwę niezmienioną
    };
  
    // Wywołuje serwis do zapisania zaktualizowanego terminu
    this.homeworkTestService.update(updatedHomeworkTest).subscribe(
      (response) => {
        // Tutaj możesz obsłużyć sukces zapisu
      },
      (error) => {
        // Tutaj możesz obsłużyć błąd
      }
    );
  
    this.isEditingDate = false;
  }
  
  
  cancelEditDate() {
    this.editedDeadline = this.homeworkTest.deadline;
    this.isEditingDate = false;
  }
  
  
  goBack() {
    this.location.back();
  }

  
        

}
