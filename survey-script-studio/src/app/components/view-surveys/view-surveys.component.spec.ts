import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ViewSurveysComponent } from './view-surveys.component';
import { SurveyService } from '../../services/survey.service';
import { provideRouter } from '@angular/router';

describe('ViewSurveysComponent', () => {
  let component: ViewSurveysComponent;
  let fixture: ComponentFixture<ViewSurveysComponent>;
  let surveyServiceSpy: jasmine.SpyObj<SurveyService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockSurveys = [
    { id: '1', title: 'Survey A', description:'', questions:[] },
    { id: '2', title: 'Survey B', description:'', questions:[] },
  ];

  beforeEach(async () => {
    surveyServiceSpy = jasmine.createSpyObj('SurveyService', [
      'getSurveys',
      'setSelectedSurvey'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ViewSurveysComponent],
      providers: [
        { provide: SurveyService, useValue: surveyServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSurveysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load surveys on init', () => {
    surveyServiceSpy.getSurveys.and.returnValue(of(mockSurveys));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBeNull();
    expect(component.surveys).toEqual(mockSurveys);
    expect(surveyServiceSpy.getSurveys).toHaveBeenCalled();
  });

  it('should handle error when loading surveys fails', () => {
    surveyServiceSpy.getSurveys.and.returnValue(throwError(() => new Error('Server error')));

    component.ngOnInit();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Failed to load surveys');
    expect(component.surveys.length).toBe(0);
  });

  it('should set selected survey and navigate to edit page', () => {
    const survey = mockSurveys[0];

    component.editSurvey(survey);

    expect(surveyServiceSpy.setSelectedSurvey).toHaveBeenCalledWith(survey);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/create-survey']);
  });

});
