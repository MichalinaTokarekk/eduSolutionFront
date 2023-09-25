import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription, catchError, map, skipWhile, switchMap } from 'rxjs';
import { RegisterService } from '../register-service/register.service';
import { throwError } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-author-edit',
  templateUrl: './register-edit.component.html',
  styleUrls: ['./register-edit.component.css']
})
export class RegisterEditComponent implements OnInit, OnDestroy{

  user: any = {};

  sub!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private registerService: RegisterService,) {

  }

  ngOnInit() {
    this.sub = this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('id');
          if (id !== null) {
            return this.registerService.get(id);
          } else {
            return "";
          }
        })
      )
      .subscribe(
        (user: any) => {
          this.user = user;
          if (user && user._links && user._links.self) {
            this.user.href = user._links.self.href;
          }
        },
        error => {
          console.error(error);
          // Additional error handling if needed
        }
      );
  }
  

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
 
  gotoList() {
    this.router.navigate(['login']);
  }

  save(form: NgForm) {
    const updatedAuthor = { ...this.user, ...form.value };
    this.registerService.save(updatedAuthor).subscribe(
      result => {
        this.gotoList();
      },
      error => console.error(error)
    );
  }
 
  remove(id: string) {
    this.registerService.remove(id).subscribe(result => {
      this.gotoList();
    },
    error => console.error(error));
  }

}
