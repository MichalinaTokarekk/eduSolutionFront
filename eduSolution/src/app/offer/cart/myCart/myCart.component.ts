import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/authorization_authentication/service/login.service';
import { CourseService } from 'src/app/course/course-service/course.service';
import { ClassGroupService } from 'src/app/classGroup/classGroup-service/classGroup.service';
import { CartService } from '../cart-service/cart.service';

@Component({
  selector: 'app-myCart',
  templateUrl: './myCart.component.html',
  styleUrls: ['./myCart.component.css']
})
export class MyCartComponent implements OnInit {
  productsInMyCartArray: any[] = [];
  filteredCourses: any []= [];
  oldUserObj: any;
  searchText: string ='';
  isEditing = false;
  ascendingSort = true;
  constructor(private http: HttpClient, private courseService: CourseService, private router: Router, private route: ActivatedRoute, 
    private classGroupService: ClassGroupService, private loginService: LoginService, private cartService: CartService){

  }

  cashAdvances: number[] = [];
  ngOnInit(): void {
    this.loadAllProductsInMyCart();
    // console.log('Total Amount:', this.getTotalAmount());

     this.productsInMyCartArray.forEach(cartItem => {
    this.cashAdvances.push(cartItem.classGroup.course.cashAdvance);
  });
  }


  courseId!: number;
  selectedCourseName: string = '';
  selectedCourseDescription: string = '';
  selectedPaymentMethod: string = '';
  loadAllProductsInMyCart() {
    const token = this.loginService.getToken();
    const _token = token.split('.')[1];
    const _atobData = atob(_token);
    const _finalData = JSON.parse(_atobData);

    this.cartService.cartsByUserId(_finalData.id).subscribe((res: any)=>{
        this.productsInMyCartArray = res;
    })   
  }

  removeFromCart(cartItemId: string): void {
    this.cartService.remove(cartItemId).subscribe(() => {
      // Odśwież koszyk po usunięciu elementu
      this.loadAllProductsInMyCart();
    });
  }

  getTotalAmount(): number {
    return this.productsInMyCartArray.reduce((total, cartItem) => total + cartItem.classGroup.course.amountToPay, 0);
  }
  
  calculateTotalCashAdvance(): number {
    return this.cashAdvances.reduce((sum, value) => sum + (value || 0), 0);
  }
  
  

}
