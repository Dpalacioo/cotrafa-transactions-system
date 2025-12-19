// src/app/shared/components/layout/layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  isSidebarOpen = false; 
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSidebarCollapse() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
