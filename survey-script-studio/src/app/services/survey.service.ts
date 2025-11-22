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
}