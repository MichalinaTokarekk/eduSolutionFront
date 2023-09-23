import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainPageComponent } from './main-page/main-page.component';
import { SemesterListComponent } from './semester/semester-list/semester-list.component';

const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  {path: "main-page", component: MainPageComponent},
  {path: "semester-list", component: SemesterListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
