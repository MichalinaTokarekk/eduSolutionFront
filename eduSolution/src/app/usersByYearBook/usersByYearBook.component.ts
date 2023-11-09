// usersByRole.component.ts

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user-service/user.service';
import { Role } from '../interfaces/role-interface';

@Component({
  selector: 'app-users-by-role',
  templateUrl: './usersByYearBook.component.html',
  styleUrls: ['./usersByYearBook.component.css'],
})
export class UsersByYearBook implements OnInit {
users: any[] = [];
filteredUsers: any[] = [];
selectedRole: Role = Role.STUDENT;


  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }
  loadAllUsers() {
    this.userService.getAll().subscribe(
      (users: any[]) => {
        this.users = users;
        this.filterUsersByRole();
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  filterUsersByRole() {
    this.filteredUsers = this.users.filter(
      (user) => user.role === this.selectedRole
    );
  }

  onRoleChange(role: Role) {
    this.selectedRole = role;
    this.filterUsersByRole();
  }
  
  getUsersYearBooks(): number[] {
    // Pobierz unikalne roczniki z listy użytkowników
    const uniqueYearBooks = [...new Set(this.users.map(user => user.yearBook))];
    return uniqueYearBooks;
  }

  getUsersByYearBook(yearBook: number): any[] {
    // Pobierz użytkowników dla określonego rocznika
    return this.users.filter(user => user.yearBook === yearBook);
  }
  
}
