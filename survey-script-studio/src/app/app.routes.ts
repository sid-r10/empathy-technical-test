import { Routes } from '@angular/router';
import { ViewSurveysComponent } from './components/view-surveys/view-surveys.component';
import { CreateSurveyComponent } from './components/create-survey/create-survey.component';

export const routes: Routes = [
    { path: 'view-surveys', component: ViewSurveysComponent },
    { path: 'create-survey', component: CreateSurveyComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' }
  ];