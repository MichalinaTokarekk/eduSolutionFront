import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionService } from '../section-service/section.service';
import { ConfirmationDialogSemesterComponent } from '../../confirmations/semester/confirmation-dialog-semester.component';
import { EduMaterialService } from 'src/app/eduMaterial/eduMaterial-service/eduMaterial.service';
import { Section } from 'src/app/interfaces/section-interface';
import { EduMaterial } from 'src/app/interfaces/eduMaterial-interface';
import { catchError, of, tap } from 'rxjs';
import { HomeworkTestService } from 'src/app/homeworkTest/homeworkTest-service/homeworkTest.service';
import { HomeworkTest } from 'src/app/interfaces/homeworkTest-interface';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'expansion-overview-example',
  templateUrl: 'section-manage.component.html',
  styleUrls: ['section-manage.component.css'],
})
export class SectionManage implements OnInit {
  panelOpenState = false;
  panels: any[] = [];

  sectionArray: any[] = [];
  filteredSections: any []= [];
  oldSectionObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private route: ActivatedRoute, private sectionService: SectionService, private router: Router, 
    private dialog: MatDialog, private snackBar: MatSnackBar, private eduMaterialService: EduMaterialService, private homeworkTestService: HomeworkTestService,
    private classGroupService: ClassGroupService, private location: Location, private loginService: LoginService){
    this.route.params.subscribe(params => {
      const courseId = params['courseId'];
      // Teraz możesz wykorzystać courseId w swoim kodzie, np. w żądaniach HTTP
    });
  }
  ngOnInit(): void {
    this.loadList();
    this.route.params.subscribe((params) => {
      const courseId = +params['courseId'];
      // Teraz masz dostęp do courseId i możesz go użyć przy tworzeniu sekcji
    });

    
  }
  onNameSort() {
    const sortedData = this.filteredSections.sort((a: any, b: any) => {
      if (this.ascendingSort) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name); // Sortowanie malejąco
      }
    });
    this.filteredSections = sortedData;
    this.ascendingSort = !this.ascendingSort; // Zmień kierunek sortowania
  }


  filter(event: any) {
    this.filteredSections = this.sectionArray.filter((searchData:any) => {
      let search = event;
      let values = Object.values(searchData);
      let flag = false
      values.forEach((val: any) => {
        if (val.toString().toLowerCase().indexOf(search) > -1) {
          flag = true;
          return;
        }
      })
      if (flag) {
        return searchData
      }
    });
  }

  loadAllUser() {
    this.sectionService.getAll().subscribe((res: any)=>{
      this.sectionArray = res;
      this.filteredSections= res;
    })
  }
  courseId!: string;
  sectionsByCourse!: Array<any>;
  eduMaterialsBySection!: any;
  homeworkTestsBySection!: any;

  sectionId!: string;
  getSectionId(sectionId: string){
    this.sectionId = sectionId;
  }

  selectedClassName: string = '';
  loadList() {
    // this.sectionService.getAll().subscribe (data => {
    //   this.sectionArray = data;
    //   this.filteredSections = data

    // })
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
      this.loadSectionsByCourseId(this.courseId);
    // this.loadEduMaterialsBySectionId(this.sectionId);
    this.classGroupService.findNameById(this.courseId).subscribe((courseName) => {
      this.selectedClassName = courseName;
    });
    });
  }

  goBack() {
    this.location.back();
  }

  // loadList() {
  //   this.route.params.subscribe(params => {
  //     this.courseId = params['courseId'];
  //     this.sectionService.getSectionsByCourseId(this.courseId).subscribe(sections => {
  //       this.sectionsByCourse = sections;
  
  //       // Wywołaj loadEduMaterialsBySectionId po uzyskaniu sekcji
  //       if (sections.length > 0) {
  //         // Zakładam, że wybierasz pierwszą sekcję, można dostosować do konkretnej sekcji
  //         const firstSectionId = sections[0].id;
  //         this.loadEduMaterialsBySectionId(firstSectionId);
  //       }
  //     });
  //   });
  // }
  

  loadSectionsByCourseId(courseId: string): void {
    this.sectionService.getSectionsByCourseId(courseId).subscribe(sections => {
      this.sectionsByCourse = sections;
    });
  }


  

  loadEduMaterialsBySectionId(sectionId: string): void {
    this.sectionService.eduMaterialsBySectionId(sectionId).subscribe(eduMaterials => {
      this.eduMaterialsBySection = eduMaterials;
    });
    this.homeworkTestService.homeworkTestsBySectionId(sectionId).subscribe(homeworkTests => {
      this.homeworkTestsBySection = homeworkTests;
    });
  }




  onAdd() {
    const obj = {
    //   "id": 1,
      "name": "",
      "isEdit": true
    };
    this.sectionArray.unshift(obj);
  }

  onRemoveFirst() {
    if (this.sectionArray.length > 0) {
        this.sectionArray.shift(); // Usuń pierwszy element z tablicy
    }
}

    onUpdate(userObj: any) {
        // write api call and send obj
      if (!userObj.name || userObj.name.trim() === '') {
        // Jeśli pole "name" jest puste, nie wykonuj aktualizacji
        return;
      }
      this.sectionService.save(userObj)
          .subscribe(
            (data) => {
                // Obsłuż dane po udanej aktualizacji
                console.log('Aktualizacja zakończona sukcesem:', data);
                userObj.isEdit = false;

            },
            (error) => {
                console.error('Błąd podczas aktualizacji:', error);
            }
          );
        
    }

  onCancel(obj:any) {
    if (this.oldSectionObj) {
      const oldObj = JSON.parse(this.oldSectionObj);
      // obj.name = oldObj.name;
      obj.isEdit = false;
  } else {
    obj.isEdit = false;
    this.onRemoveFirst();

  }
  }


onDelete(obj: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.sectionService.remove(obj.id).subscribe(
          response => {
            this.loadList();
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

    // this.sectionService.remove(obj.id).pipe(
    //   tap(response => {this.loadList();
    //   }),
    //   catchError(error => {
    //     let errorMessage = 'An error occurred';
    //     if (error && error.error) {
    //       errorMessage = error.error;
    //     }
    //     this.openSnackBar(errorMessage, 'Error');
    //     return of(); // Zwracamy pustego observable w przypadku błędu
    //   })
    // ).subscribe();
  }

  
onDeleteEduMaterial(obj: any) {
  const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);

  dialogRef.afterClosed().subscribe((result: boolean) => {
    if (result === true) {
      this.eduMaterialService.remove(obj.id).subscribe(
        response => {
          this.loadList();
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

  // this.eduMaterialService.remove(obj.id).pipe(
  //   tap(response => {this.loadList();
  //   }),
  //   catchError(error => {
  //     let errorMessage = 'An error occurred';
  //     if (error && error.error) {
  //       errorMessage = error.error;
  //     }
  //     this.openSnackBar(errorMessage, 'Error');
  //     return of(); // Zwracamy pustego observable w przypadku błędu
  //   })
  // ).subscribe();
  
}

onDeleteHomeworkTest(obj: any) {
  const dialogRef = this.dialog.open(ConfirmationDialogSemesterComponent);

  dialogRef.afterClosed().subscribe((result: boolean) => {
    if (result === true) {
      this.homeworkTestService.remove(obj.id).subscribe(
        response => {
          this.loadList();
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

  isNameEmpty = false;


  validateCourseName(name: string) {
    if (!name) {
        this.isNameEmpty = true;
        return "Pole wymagane";
    } else {
        this.isNameEmpty = false;
        return "";
    }
}

// onEdit(userObj: any) {
//   this.oldSectionObj = JSON.stringify(userObj);
//   this.sectionArray.forEach(element => {
//     element.isEdit = false;
//   });
//   userObj.isEdit = true;
// }

currentEditingSection: any;
isNewSection = true; 

onEdit(section: any) {
  // Zapisz aktualnie edytowaną sekcję
  this.currentEditingSection = section;

  // Ustaw flagę isEdit na true dla wybranej sekcji
  section.isEdit = true;
}

newSectionName = '';
isAddingNewSection: boolean = false;


  onAddSection() {
    
    const newPanel = {
      title: 'Nowy panel',
      content: 'Zawartość nowego panelu',
      sectionName: this.newSectionName, // Dodaj nazwę sekcji do panelu
    };
    this.panels.push(newPanel);
    this.newSectionName = '';
    this.isAddingNewSection = true;
  }


  

  // onSave(section: any, newName: string) {
  //   section.name = newName;
  //   section.isEdit = true; // Zakładając, że używasz zmiennej 'isEdit' do określenia trybu edycji sekcji
  //   // Wywołaj metodę save z twojego serwisu, zakładając, że masz dostęp do section.href
  //   this.sectionService.save({ href: section.href, name: newName }).subscribe((response) => {
  //     section.name = response.name; // Zaaktualizuj nazwę sekcji w panelu
  //     section.isEdit = false; // Wyłącz tryb edycji
  //     this.sectionService.save(section.name)
  //   });
  //   this.sectionService.save(section.name)
    
  // }

  onSave(section: any) {
    if (this.currentEditingSection) {
      if (!this.currentEditingSection.name) {
        console.error('Nazwa sekcji nie może być pusta!');
        return;
      }
      // Edytuj aktualnie zapisywaną sekcję
      this.sectionService.save(this.currentEditingSection).subscribe((response) => {
        section.isEdit = false; // Wyłącz tryb edycji
      });
      this.currentEditingSection = null; // Wyczyść aktualnie edytowaną sekcję
    } else if(this.isAddingNewSection){
      this.sectionService.save(this.currentEditingSection).subscribe((response) => {
        this.isAddingNewSection = false;
      });
    }
  }
  
  

  onSaveNew() {
    if (!this.newSectionName) {
      console.error('Nazwa sekcji nie może być pusta!');
      return;
    }
    // Pobierz ID kursu wybranego przez użytkownika
    const classGroupId = this.route.snapshot.params['courseId'];
    const newSection = {
      name: this.newSectionName,
      classGroup: {
        id: classGroupId
      },
      // Jeśli masz dostęp do właściwości href, możesz ją ustawić tutaj
    };
  
    newSection.classGroup = classGroupId;
    this.sectionService.save(newSection).subscribe((response) => {
      // Tutaj możesz obsłużyć odpowiedź z serwera, np. zaktualizować dane w komponencie
      console.log('Nowa sekcja została zapisana w bazie danych:', response);
      this.sectionArray.push(response);
      location.reload();
  
      // Jeśli zapis się powiódł, można wyczyścić pole newSectionName
      this.newSectionName = '';
  
      // Zaznacz, że nie dodajemy już nowej sekcji
      this.isAddingNewSection = false;
    });
  }

  newMaterialName: string = '';
  newHomeworkTestName: string = '';
  isAddingNewEduMaterial = true;
  
  // onAddMaterial(section: any){
  //   // console.log("Zawartość section:", section.id);
  //   const eduMaterial = {
  //     name: this.newMaterialName, 
  //     sectionId: section.id
  //   };
  //   this.eduMaterialService.save(eduMaterial).subscribe(
  //     (response) => {
  //       this.sectionService.get(section)
  //       console.log("Dodane pomyslnie")

  //       if (response.sections) {
  //         response.sections = [];
  //         console.log(response.sections)
  //       }

  //       response.sections.push(section.id);
  //     }
  //   )







    // const section = this.sectionService.get(sectionId);
    
    // this.currentEditingSection.eduMaterial = eduMaterial;
    // this.isEditing = false;

    // this.sectionService.updateEduMaterial(sectionId).subscribe(
    //   (updatedSection) => {
    //     this.currentEditingSection.eduMaterial = sectionId.eduMaterial;
    //     // Object.assign(this.currentEditingSection.eduMaterial, sectionId.eduMaterial);
    //     console.log("Sekcja zaktualizowana pomyślnie", updatedSection);
    //   }
    // )
  // }

  sectionMaterials: any[] = [];

  onAddMaterial(section: any) {
    if (section && section.id) {
      // Utwórz nowy materiał edukacyjny
      const eduMaterial: EduMaterial = {
        id: 0, // Jeśli ID jest automatycznie generowane przez serwer, pozostaw to jako 0
        name: this.newMaterialName,
        sections: [section] // Dodaj sekcję do materiału
      };
  
      this.eduMaterialService.save(eduMaterial).subscribe(
        (response) => {
          console.log("Dodane pomyslnie");
  
          // Pobierz indeks sekcji w materiałach
          const sectionIndex = this.sectionMaterials.findIndex((s) => s.id === section.id);
  
          // Jeśli sekcja jest już w materiałach, zaktualizuj ją, w przeciwnym razie dodaj nową sekcję
          if (sectionIndex !== -1) {
            this.sectionMaterials[sectionIndex].sections.push(response);
          } else {
            this.sectionMaterials.push(response);
          }
        },
        (error) => {
          console.error("Błąd podczas dodawania materiału:", error);
        }
      );
    } else {
      console.error("Błąd: section lub section.id jest niezdefiniowany.");
    }
    this.newSectionName = '';
    section.isEdit = false;
  }


  sectionHomeworkTests: any[] = [];
  newHomeworkTestDeadline!: Date;

  onAddHomeworkTest(section: any) {
    if (section && section.id) {
      // Utwórz nowy materiał edukacyjny
      
      const homeworkTest: HomeworkTest = {
        id: 0, // Jeśli ID jest automatycznie generowane przez serwer, pozostaw to jako 0
        name: this.newHomeworkTestName,
        deadline: this.newHomeworkTestDeadline,
        section: section // Dodaj sekcję do materiału
      };
  
      this.homeworkTestService.save(homeworkTest).subscribe(
        (response) => {
          console.log("Dodane pomyslnie");
  
          // Pobierz indeks sekcji w materiałach
          const sectionIndex = this.sectionHomeworkTests.findIndex((s) => s.id === section.id);
  
          // Jeśli sekcja jest już w materiałach, zaktualizuj ją, w przeciwnym razie dodaj nową sekcję
          if (sectionIndex !== -1) {
            this.sectionHomeworkTests[sectionIndex].sections.push(response);
          } else {
            this.sectionHomeworkTests.push(response);
          }
        },
        (error) => {
          console.error("Błąd podczas dodawania materiału:", error);
        }
      );
    } else {
      console.error("Błąd: section lub section.id jest niezdefiniowany.");
    }
    this.newSectionName = '';
    section.isEdit = false;
  }
  
  

  
  
  


  
  

  onBackButton(obj: any) {
    obj.isEdit = false;
  }

  onCloseButton() {
    this.isAddingNewSection = false;
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
