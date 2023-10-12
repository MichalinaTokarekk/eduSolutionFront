import { HttpClient } from '@angular/common/http';
import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
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


/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'homeworkTest-manage.component.html',
  styleUrls: ['homeworkTest-manage.component.css'],
})
export class HomeworkTestManage implements OnInit {
homeworkTest: any = {};
classGroupsByUserId: any = {};
htFileIdContainer: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, 
    private homeworkTestService: HomeworkTestService, private htFileService: HTFileService, private answerService: AnswerService, private loginService: LoginService,
    private aFileService: AFileService, private classGroupService: ClassGroupService, private courseService: CourseService, private userService: UserService){
  }

htFilesByHomeworkTest!: Array<any>;

htFiles!: any[]; 
aFiles!: any[]; 
course!: any; 
answer!: any; 
answerId!: any; 
ngOnInit(): void {
    // Pobierz ID materiału edukacyjnego z parametrów routingu
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id !== null) {
        // Użyj usługi do pobrania materiału edukacyjnego na podstawie ID
        this.homeworkTestService.get(id).subscribe((homeworkTest: any) => {
          // Zapisz materiał edukacyjny w komponencie
          this.homeworkTest = homeworkTest;
  
          // Pobierz pliki materiałów edukacyjnych po ID materiału edukacyjnego
          this.htFileService.htFilesByHomeworkTestsId(homeworkTest.id).subscribe((htFiles: any) => {
            // Tutaj możesz wykonać operacje na emFiles, np. przypisać je do właściwości komponentu
            this.htFiles = htFiles;
          }, error => {
            console.error(error);
            // Obsłuż błąd, jeśli wystąpi
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
          // Obsłuż błąd, jeśli wystąpi
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
            console.log('courseId', homeworkTest.section.course.id)

            this.loadClassGroupsByCoursesId(homeworkTest.section.course.id);
      
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

      this.userService.getTeachingClassGroupsByUserId(_finalData.id).subscribe(classGroups => {
        this.classGroupsByUserId = classGroups;

        console.log('Klasy użytkownika:', this.classGroupsByUserId);
        // console.log('filter', this.filteredClassGroups);
      }, error => {
        console.error('Błąd podczas pobierania klas użytkownika:', error);
      });
      

      
  }

  filteredClassGroups: ClassGroup[] = [];

  filterClassGroups(): void {
    this.filteredClassGroups = this.classGroupsByCoursesId.filter((courseClassGroup: ClassGroup) => {
      // Sprawdź, czy classGroup jest obecny w classGroupsByUserId
      const foundUserClassGroup = this.classGroupsByUserId.find((userClassGroup: ClassGroup) => userClassGroup.id === courseClassGroup.id);
      
      return foundUserClassGroup !== undefined;
    });
  
    console.log('filter', this.filteredClassGroups);
  }
  
  
  
  
  

  aFilesByAnswer!: any;
  loadAFilesByAnswerId(answerId: string): void {
    this.aFileService.aFilesByAnswerId(answerId).subscribe(aFiles => {
        this.aFilesByAnswer = aFiles;
      });
  }

//   classGroupsByCoursesId!: any;
// classGroupsByCoursesId: any[] = [];
classGroupsByCoursesId: ClassGroup[] = [];
  loadClassGroupsByCoursesId(courseId: string): void {
    this.classGroupService.findClassGroupsByCoursesId(courseId).subscribe(classGroups => {
        this.classGroupsByCoursesId = classGroups as ClassGroup[];
        this.filterClassGroups();
        console.log('classGroupsByCoursesId:', this.classGroupsByCoursesId);
      });
      console.log('Została wywołana');
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
          console.error("Błąd podczas przesyłania pliku:", uploadError);
          console.log("fileToUpload:", this.fileToUpload);
          console.log("id:", id);

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
            user: _finalData.id
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
            console.error("Błąd podczas przesyłania pliku:", uploadError);
            console.log("aFileToUpload:", this.aFileToUpload);
            console.log("answerId:", answer.id);
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
        

}
