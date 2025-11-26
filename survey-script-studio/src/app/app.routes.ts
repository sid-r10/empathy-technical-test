import { Routes } from '@angular/router';
import { ViewSurveysComponent } from './components/view-surveys/view-surveys.component';
import { CreateSurveyComponent } from './components/create-survey/create-survey.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'view-surveys', component: ViewSurveysComponent },
    { path: 'create-survey', component: CreateSurveyComponent },
    { path: '', component: HomeComponent }
  ];