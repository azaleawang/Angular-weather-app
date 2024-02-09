import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterLink } from '@angular/router';

import { WelcomeComponent } from "./welcome.component";
import { RouterTestingModule } from "@angular/router/testing";
import { DebugElement } from '@angular/core';
import { By } from "@angular/platform-browser";

describe("WelcomeComponent", () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display the header", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")).toBeTruthy();
  });

  it('should have a start button', () => {
    const compiled = fixture.debugElement.nativeElement as HTMLElement;
    expect(compiled.querySelector("#startBtn")).toBeTruthy();
  });

});
