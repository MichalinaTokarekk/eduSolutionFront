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
    private eduMaterialService: EduMaterialService){
    
  }
  
  
  ngOnInit(): void {
    // Pobierz ID materiału edukacyjnego z parametrów routingu
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (id !== null) {
        // Użyj usługi do pobrania materiału edukacyjnego na podstawie ID
        this.eduMaterialService.get(id).subscribe((eduMaterial: any) => {
          this.eduMaterial = eduMaterial;
        }, error => {
          console.error(error);
          // Obsłuż błąd, jeśli wystąpi
        });
      } else {
        console.log("Nie ma nic")
      }
    });
  }

  submitForm() {
    // Wywołaj usługę, aby zapisać materiał edukacyjny
    this.eduMaterialService.save(this.eduMaterial).subscribe(
      (savedEduMaterial: EduMaterial) => {
        console.log('Zapisano zmiany:', savedEduMaterial);
        // Możesz dodać obsługę sukcesu tutaj
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
}
