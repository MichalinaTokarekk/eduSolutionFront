import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SectionService } from '../section-service/section.service';
import { ConfirmationDialogSemesterComponent } from '../../confirmations/semester/confirmation-dialog-semester.component';

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
  constructor(private http: HttpClient, private sectionService: SectionService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar){

  }
  ngOnInit(): void {
    this.loadList();
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

  loadList() {
    this.sectionService.getAll().subscribe (data => {
      this.sectionArray = data;
      this.filteredSections = data

    })
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
  
    const newSection = {
      name: this.newSectionName,
    };
    this.panels.push(newPanel);
    this.isAddingNewSection = true;    
    this.newSectionName = '';
    this.isAddingNewSection = true;
    
    this.sectionService.save(newSection)
    
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
      // Edytuj aktualnie zapisywaną sekcję
      this.sectionService.save(this.currentEditingSection).subscribe((response) => {
        section.isEdit = false; // Wyłącz tryb edycji
      });
      this.currentEditingSection = null; // Wyczyść aktualnie edytowaną sekcję
    }
  }
  
  
}
