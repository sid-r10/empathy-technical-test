import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyService, Survey } from '../../services/survey.service';

@Component({
  selector: 'app-view-surveys',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-surveys.component.html',
  styleUrl: './view-surveys.component.css'
})
export class ViewSurveysComponent implements OnInit {
  surveys: Survey[] = [];
  loading = false;
  error: string | null = null;
  userEmail: string = 'user1@sss.com'; //sss -> survey script studio :)
  constructor(private surveyService: SurveyService) { }

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.loading = true;
    this.error = null;

    this.surveyService.getSurveys(this.userEmail).subscribe({
      next: (data) => {
        this.surveys = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load surveys';
        this.loading = false;
        console.error('Error loading surveys:', err);
      }
    });
  }
}