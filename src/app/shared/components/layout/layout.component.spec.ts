import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { TransactionsComponent } from '../../../features/transactions/pages/transactions/transactions.component';
import { TransactionsHistoryComponent } from '../../../features/transactions/components/transactions-history/transactions-history.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([
          { path: 'transactions', component: TransactionsComponent },
          { path: 'history', component: TransactionsHistoryComponent },
          { path: '', redirectTo: 'transactions', pathMatch: 'full' },
        ]),
        provideLocationMocks(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should have sidebar closed by default', () => {
      expect(component.isSidebarOpen).toBeFalse();
    });

    it('should have sidebar not collapsed by default', () => {
      expect(component.isSidebarCollapsed).toBeFalse();
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle isSidebarOpen from false to true', () => {
      // Arrange
      component.isSidebarOpen = false;

      // Act
      component.toggleSidebar();

      // Assert
      expect(component.isSidebarOpen).toBeTrue();
    });

    it('should toggle isSidebarOpen from true to false', () => {
      // Arrange
      component.isSidebarOpen = true;

      // Act
      component.toggleSidebar();

      // Assert
      expect(component.isSidebarOpen).toBeFalse();
    });

    it('should toggle isSidebarOpen multiple times', () => {
      // Arrange
      component.isSidebarOpen = false;

      // Act: toggle 3 veces
      component.toggleSidebar(); // true
      component.toggleSidebar(); // false
      component.toggleSidebar(); // true

      // Assert
      expect(component.isSidebarOpen).toBeTrue();
    });
  });

  describe('toggleSidebarCollapse', () => {
    it('should toggle isSidebarCollapsed from false to true', () => {
      // Arrange
      component.isSidebarCollapsed = false;

      // Act
      component.toggleSidebarCollapse();

      // Assert
      expect(component.isSidebarCollapsed).toBeTrue();
    });

    it('should toggle isSidebarCollapsed from true to false', () => {
      // Arrange
      component.isSidebarCollapsed = true;

      // Act
      component.toggleSidebarCollapse();

      // Assert
      expect(component.isSidebarCollapsed).toBeFalse();
    });

    it('should not affect isSidebarOpen when toggling collapse', () => {
      // Arrange
      component.isSidebarOpen = true;
      component.isSidebarCollapsed = false;

      // Act
      component.toggleSidebarCollapse();

      // Assert
      expect(component.isSidebarCollapsed).toBeTrue();
      expect(component.isSidebarOpen).toBeTrue(); // No cambió
    });
  });

  describe('closeSidebar', () => {
    it('should set isSidebarOpen to false when it is true', () => {
      // Arrange
      component.isSidebarOpen = true;

      // Act
      component.closeSidebar();

      // Assert
      expect(component.isSidebarOpen).toBeFalse();
    });

    it('should keep isSidebarOpen as false when it is already false', () => {
      // Arrange
      component.isSidebarOpen = false;

      // Act
      component.closeSidebar();

      // Assert
      expect(component.isSidebarOpen).toBeFalse();
    });

    it('should not affect isSidebarCollapsed when closing sidebar', () => {
      // Arrange
      component.isSidebarOpen = true;
      component.isSidebarCollapsed = true;

      // Act
      component.closeSidebar();

      // Assert
      expect(component.isSidebarOpen).toBeFalse();
      expect(component.isSidebarCollapsed).toBeTrue(); // No cambió
    });
  });

  describe('Integration between methods', () => {
    it('should work correctly with multiple operations', () => {
      // Estado inicial
      expect(component.isSidebarOpen).toBeFalse();
      expect(component.isSidebarCollapsed).toBeFalse();

      // Abrir sidebar
      component.toggleSidebar();
      expect(component.isSidebarOpen).toBeTrue();
      expect(component.isSidebarCollapsed).toBeFalse();

      // Colapsar sidebar
      component.toggleSidebarCollapse();
      expect(component.isSidebarOpen).toBeTrue();
      expect(component.isSidebarCollapsed).toBeTrue();

      // Cerrar sidebar
      component.closeSidebar();
      expect(component.isSidebarOpen).toBeFalse();
      expect(component.isSidebarCollapsed).toBeTrue(); // Mantiene el estado colapsado

      // Expandir sidebar nuevamente
      component.toggleSidebarCollapse();
      expect(component.isSidebarCollapsed).toBeFalse();
    });
  });
});
