import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  messageClass=''
  message=''
  customerId: any;
  editData: any;
  responseData: any;

  constructor(private service:LoginService, private route:Router){
    localStorage.clear();
  }

  Login = new FormGroup({
      email: new FormControl ("",Validators.required),
      password: new FormControl ("",Validators.required)
  });

  ngOnInit(): void {
  }

  ProceedLogin (){
    if(this.Login.valid){
      this.service.proceedLogin(this.Login.value).subscribe(result=>{
        if(result!=null){
          this.responseData = result;
          localStorage.setItem('token',this.responseData.token);
          this.route.navigate(['/main-page']);
        } else{
          alert("Logowanie nieudane");
        }
      })
    }
  }
}
