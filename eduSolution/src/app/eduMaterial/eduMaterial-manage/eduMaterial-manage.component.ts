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

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar, 
    private eduMaterialService: EduMaterialService, private emFileService: EMFileService){
    
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
ngOnInit(): void {
    // Pobierz ID materiału edukacyjnego z parametrów routingu
    this.route.paramMap.subscribe((params: ParamMap) => {
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

  fileToUpload: File | null = null;

//   onFileSelected(event: Event) {
//     const inputElement = event.target as HTMLInputElement;
//     if (inputElement.files && inputElement.files.length > 0) {
//       this.fileToUpload = inputElement.files[0];
//     }
//   }

//   onAddEMFile(eduMaterial: any) {
//     if (this.fileToUpload) {
//         const emFile: EMFile = {
//             id: 0,
//             eduMaterials: [eduMaterial],
//             filePath: ''
//         };

//         // Tworzymy obiekt FormData i dodajemy wybrany plik
//         const formData = new FormData();
//         formData.append('file', this.fileToUpload);

//         // Wywołujemy usługę, aby przesłać plik
//         this.emFileService.save(this.fileToUpload).subscribe(
//             (response: any) => {
//                 // Tutaj możesz obsłużyć odpowiedź po przesłaniu pliku, np. dostęp do ścieżki pliku
//                 emFile.filePath = response.filePath;

               
//             },
//             (uploadError) => {
//                 console.error('Błąd podczas przesyłania pliku:', uploadError);
//                 // Obsłuż błąd przesyłania pliku, jeśli wystąpi
//                 console.log('dane', emFile);

//             }
//         );
//     } else {
//         console.log('Nie wybrano pliku.');
//     }
// }

onAddFile() {
    if (this.fileToUpload) {
      this.emFileService.uploadFile(this.fileToUpload).subscribe(
        (response: string) => {
          console.log("Plik został przesłany:", response);
          // Tutaj możesz obsłużyć odpowiedź po przesłaniu pliku, np. dostęp do ścieżki pliku
        },
        (uploadError) => {
          console.error("Błąd podczas przesyłania pliku:", uploadError);
        }
      );
    } else {
      console.log("Nie wybrano pliku.");
    }
  }

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
      const url = window.URL.createObjectURL(blob);
  
      // Tworzymy element <a> i nadajemy mu atrybuty, aby otworzyć pobrany plik w nowej karcie
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = `${fileId}.pdf`; // Zmień nazwę pliku na coś sensownego lub korzystając z informacji o pliku
  
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
