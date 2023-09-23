import { Component, OnInit,  ViewChild, AfterViewInit } from '@angular/core';
// import { Observable } from '@rxjs';
import { ReplaySubject, Subject, catchError, of, take, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',

})
export class MainPageComponent implements OnInit{
  constructor (private router: Router) {}


  ngOnInit(){
    this.loadList();
  
  }

  loadList() {
  }
}
