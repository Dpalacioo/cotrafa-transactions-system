import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TranslateModule } from '@ngx-translate/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onMenuClick', () => {
    it('should emit menuToggle event when onMenuClick is called', () => {
      spyOn(component.menuToggle, 'emit');

      component.onMenuClick();

      expect(component.menuToggle.emit).toHaveBeenCalled();
    });

    it('should emit menuToggle event when called multiple times', () => {
      spyOn(component.menuToggle, 'emit');

      component.onMenuClick();
      component.onMenuClick();
      component.onMenuClick();

      expect(component.menuToggle.emit).toHaveBeenCalledTimes(3);
    });
  });

  describe('Template', () => {
    it('should have a button that triggers onMenuClick', () => {
      // Arrange
      spyOn(component, 'onMenuClick');
      const button = fixture.nativeElement.querySelector('button');

      // Act: simula clic en el botón
      button.click();

      // Assert: verifica que se llamó al método
      expect(component.onMenuClick).toHaveBeenCalled();
    });

    it('should display menu icon', () => {
      const icon = fixture.nativeElement.querySelector('mat-icon');
      expect(icon).toBeTruthy();
      expect(icon.textContent).toContain('menu');
    });
  });
});
