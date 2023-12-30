import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Answer } from "src/app/interfaces/answer-interface";


@Injectable()
export class CartService {

  public API = '//localhost:9191';
  public CART_API = this.API + '/cart-controller';

  constructor (private http: HttpClient){}

  getAll(): Observable<any> {
    return this.http.get(this.CART_API + '/carts')
  }

  get(id: string) {
    return this.http.get(this.CART_API + '/cart/' + id);
  }

  save (cart: any) : Observable <any> {
    let result: Observable<Object>;
    result = this.http.post(this.CART_API + '/addCart', cart)
    return result;
  }

  updateCart(cart: any): Observable <any> {
    let result: Observable<Object>;
    result = this.http.put(this.CART_API + '/updateCart', cart)
    return result;
  }

  remove (id: string):Observable<string> {
    return this.http.delete<string>(this.CART_API + '/deleteCart/' + id);
  }


  cartsByUserId(userId: string) {
    return this.http.get(this.CART_API + '/cartsByUserId/' + userId);
  }

//   isClassGroupAssignedToUser(classGroupId: string, userId: string): Observable<boolean> {
//     return this.http.get<boolean>(this.CART_API + `/isClassGroupAssignedToUser/${classGroupId}/${userId}`);
//   }
  
    countByUserId(userId: number) {
        return this.http.get<string>(this.CART_API + '/countByUserId/' + userId);
    }
}


