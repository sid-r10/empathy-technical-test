import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Question {
  questionId: number;
  questionText: string;
  mandatoryInd: boolean;
  questionType: number;
  options: string[];
  randomizeOptionsInd: boolean;
  placeholder?: string;
  cards: string[];
  programmerNotes: string;
  instructions: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface CreateSurveyRequest {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  private apiUrl = 'https://techtestapi1.azurewebsites.net/survey'; 
  constructor(private http: HttpClient) { }

  private getHeaders(email: string): HttpHeaders {
    return new HttpHeaders({
      'x-api-key': email
    });
  }

  getSurveys(email: string): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.apiUrl, {
      headers: this.getHeaders(email)
    });
  }

  createSurvey(survey: CreateSurveyRequest, email: string): Observable<Survey> {
    return this.http.post<Survey>(this.apiUrl, survey, {
      headers: this.getHeaders(email)
    });
  }

  updateSurvey(survey: CreateSurveyRequest, email: string): Observable<Survey> {
    return this.http.put<Survey>(this.apiUrl + `/${survey.id}`, survey, {
      headers: this.getHeaders(email)
    });
  }

  private selectedSurvey: any | null = null;

  setSelectedSurvey(survey: any) {
    this.selectedSurvey = survey;
  }

  getSelectedSurvey() {
    return this.selectedSurvey;
  }

  clearSelectedSurvey() {
    this.selectedSurvey = null;
  }
}