import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
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
import { Location } from '@angular/common';
import { SectionService } from 'src/app/section/section-service/section.service';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';


/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'eduMaterial-manage.component.html',
  styleUrls: ['eduMaterial-manage.component.css'],
})
export class EduMaterialManage implements OnInit {
eduMaterial: any = {};
  emFileIdContainer: any;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, 
    private eduMaterialService: EduMaterialService, private emFileService: EMFileService, private location: Location, private sectionService: SectionService, 
    private loginService: LoginService){
  }

  emFilesByEduMaterial!: Array<any>;
  
  
//   ngOnInit(): void {
//     // Pobierz ID materiału edukacyjnego z parametrów routingu
//     this.route.paramMap.subscribe((params: ParamMap) => {
//       const id = params.get('id');
//       if (id !== null) {
//         // Użyj usługi do pobrania materiału edukacyjnego na podstawie ID
//         this.eduMaterialService.get(id).subscribe((eduMaterial: any) => {
//           this.eduMaterial = eduMaterial;
//         }, error => {
//           console.error(error);
//           // Obsłuż błąd, jeśli wystąpi
//         });
//       } else {
//         console.log("Nie ma nic")
//       }
//     });
//   }

emFiles!: any[]; 
selectedSectionName: string = '';
sectionId: string | null = null;
ngOnInit(): void {
    // Pobierz ID materiału edukacyjnego z parametrów routingu
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.sectionId = params.get('sectionId');
      const id = params.get('id');
      if (id !== null) {
        // Użyj usługi do pobrania materiału edukacyjnego na podstawie ID
        this.eduMaterialService.get(id).subscribe((eduMaterial: any) => {
          // Zapisz materiał edukacyjny w komponencie
          this.eduMaterial = eduMaterial;
  
          // Pobierz pliki materiałów edukacyjnych po ID materiału edukacyjnego
          this.emFileService.emFilesByEduMaterialId(eduMaterial.id).subscribe((emFiles: any) => {
            // Tutaj możesz wykonać operacje na emFiles, np. przypisać je do właściwości komponentu
            this.emFiles = emFiles;
            if (this.sectionId !== null) {
              this.sectionService.findNameById(this.sectionId).subscribe((sectionName) => {
                this.selectedSectionName = sectionName;
                console.log('sectionId', this.sectionId);
              });
            }
          }, error => {
            console.error(error);
            // Obsłuż błąd, jeśli wystąpi
          });
        }, error => {
          console.error(error);
          // Obsłuż błąd, jeśli wystąpi
        });
       
      } else {
        console.log("Nie ma nic");
      }
    });

    
  }
  

  loadEMFilesByEduMaterialId(eduMaterialId: string): void {
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
    this.eduMaterialService.save(this.eduMaterial).subscribe(
      (savedEduMaterial: EduMaterial) => {
        console.log('Zapisano zmiany:', savedEduMaterial);
        // Możesz dodać obsługę sukcesu tutaj
        this.eduMaterial.isEdit = false;
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

  notOnEdit(section: any) {
    // Zapisz aktualnie edytowaną sekcję
    this.currentEditingSection = section;
  
    // Ustaw flagę isEdit na true dla wybranej sekcji
    section.isEdit = false;
  }



eduMaterialEMFiles: any[] = [];
  // emFileId!: number;

onAddFile(eduMaterial: any) {
  this.route.paramMap.subscribe((params: ParamMap) => {
    const id = params.get('id');
    if (id !== null) {
        
  
  const emFile: EMFile = {
    id: id, // Jeśli ID jest automatycznie generowane przez serwer, pozostaw to jako 0
    eduMaterial: eduMaterial, 
    // name: this.fileToUpload.name, 
    // type: this.fileToUpload.type,
    // fileData: new Uint8Array(0) 
  };
  
    if (this.fileToUpload) {
      this.emFileService.uploadFile(this.fileToUpload, id).subscribe(
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
      


      // this.emFileService.save(emFile).subscribe(
      //   (response) => {
      //     console.log("Dodane pomyslnie");

      //     emFile.id = response.id;
  
      //     // Pobierz indeks sekcji w materiałach
      //     const eduMaterialIndex = this.eduMaterialEMFiles.findIndex((s) => s.id === eduMaterial.id);
  
      //     // Jeśli sekcja jest już w materiałach, zaktualizuj ją, w przeciwnym razie dodaj nową sekcję
      //     if (eduMaterialIndex !== -1) {
      //       this.eduMaterialEMFiles[eduMaterialIndex].emFile = emFile;
      //     }
      //   },
      //   (error) => {
      //     console.error("Błąd podczas dodawania materiału:", error);
      //     console.error("emFile:", emFile);
      //   }
      // );
    
    
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
        this.emFileService.remove(obj.id).subscribe(
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

//   downloadFile(fileName: string): void {
//     this.emFileService.downloadFile(fileName).subscribe((blob: Blob) => {
//       // Tworzymy link do pobierania pliku
//       const url = window.URL.createObjectURL(blob);
  
//       // Tworzymy element <a> i nadajemy mu atrybuty, aby otworzyć pobrany plik w nowej karcie
//       const a = document.createElement('a');
//       document.body.appendChild(a);
//       a.style.display = 'none';
//       a.href = url;
//       a.download = fileName;
  
//       // Klikamy na ten element, aby rozpocząć pobieranie pliku
//       a.click();
  
//       // Po pobraniu pliku usuwamy link i element <a>
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     }, error => {
//       console.error('Błąd podczas pobierania pliku', error);
//     });
//   }
  
downloadFileById(fileId: number): void {
    this.emFileService.downloadFileById(fileId).subscribe((blob: Blob) => {
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


  goBack() {
    this.location.back();
  }
  
  onCloseButton() {
    this.eduMaterial.isEdit = false;
    location.reload();
  }

  actions(){
    if(this.loginService.getToken()!=''){
      let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
      if(_currentRole=='admin' ||  _currentRole=='teacher' || _currentRole=='user'){
        return true;
      }
    }
    return false
  }

actionsTeachacher(){
  if(this.loginService.getToken()!=''){
    let _currentRole = this.loginService.getRoleByToken(this.loginService.getToken());
    if(_currentRole=='admin' || _currentRole == 'teacher'){
      return true;
    }
  }
  return false
}
  

}
