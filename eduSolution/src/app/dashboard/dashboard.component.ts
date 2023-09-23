import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    constructor(private router: Router) {}

    panelVisible = false;

    panelStyles: { [key: string]: string } = {};

    togglePanel() {
      this.panelVisible = !this.panelVisible;
      this.panelStyles = {
        left: this.panelVisible ? '0' : '-250px'
      };
    }
}