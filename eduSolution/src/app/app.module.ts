import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';

import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SemesterListComponent } from './semester/semester-list/semester-list.component';
import { SemesterService } from './semester/semester-service/semester.service';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';




@NgModule({
  exports: [
    MatGridListModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatTableModule
  ],
  declarations: [
    
  ]
})
export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainPageComponent,
    SemesterListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [SemesterService],
  bootstrap: [AppComponent]
})
export class AppModule { }
