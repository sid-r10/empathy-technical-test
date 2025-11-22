import { Routes } from '@angular/router';
import { ViewSurveysComponent } from './components/view-surveys/view-surveys.component';

export const routes: Routes = [
    { path: 'view-surveys', component: ViewSurveysComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' }
  ];