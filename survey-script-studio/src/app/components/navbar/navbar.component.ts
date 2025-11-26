import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SurveyService, CreateSurveyRequest, Question, Survey } from '../../services/survey.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ CommonModule, RouterLink, RouterLinkActive ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private surveyService: SurveyService, private router: Router) {}

  createNewSurvey(): void {
    console.log('clearSelectedSurvey');
    
    this.surveyService.clearSelectedSurvey();
  }
}
