import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SurveyService, CreateSurveyRequest, Question } from '../../services/survey.service';

enum QuestionType {
  SINGLE_CHOICE = 'single-choice',
  MULTIPLE_CHOICE = 'multiple-choice',
  SINGLE_LINE_INPUT = 'single-line-input',
  DROPDOWN_LIST = 'dropdown-list'
}

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-survey.component.html',
  styleUrl: './create-survey.component.css'
})

export class CreateSurveyComponent {
  title: string = '';
  description: string = '';
  loading = false;
  success = false;
  error: string | null = null;
  userEmail: string = 'user1@sss.com'; //sss -> survey script studio :)
  questionTypes = [
    {
      id: QuestionType.SINGLE_CHOICE,
      name: 'Single Choice',
      description: 'Allow one answer selection'
    },
    {
      id: QuestionType.MULTIPLE_CHOICE,
      name: 'Multiple Choice',
      description: 'Allow multiple answer selections'
    },
    {
      id: QuestionType.SINGLE_LINE_INPUT,
      name: 'Single-Line Input',
      description: 'Single line text input'
    },
    {
      id: QuestionType.DROPDOWN_LIST,
      name: 'Dropdown List',
      description: 'Dropdown selection menu'
    }
  ];
  surveyTitle: string = 'Survey Title';
  surveySubtitle: string = 'Survey Subtitle';
  selectedQuestionType: string | null = null;
  questions: Question[] = [];
  maxQuestions: number = 5;
  nextQuestionId: number = 1; 

  constructor(private surveyService: SurveyService) {}

  onSubmit(): void {
    if (!this.title || !this.description) {
      this.error = 'Title and description are required';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    const surveyData: CreateSurveyRequest = {
      title: this.title,
      description: this.description,
      questions: []
    };

    this.surveyService.createSurvey(surveyData, this.userEmail).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.title = '';
        this.description = '';
      },
      error: (err) => {
        this.error = 'Failed to create survey';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  onQuestionTypeClick(questionTypeId: string): void {
    this.selectedQuestionType = questionTypeId;
    console.log(this.selectedQuestionType);

    if (this.questions.length >= this.maxQuestions) {
      alert(`Maximum ${this.maxQuestions} questions allowed.`);
      return;
    }

    const newQuestion: Question = {
      questionId: this.nextQuestionId++,
      questionText: '',
      questionType: questionTypeId,
      mandatoryInd: false,
      options: questionTypeId === 'single-choice' || 
              questionTypeId === 'multiple-choice' || 
              questionTypeId === 'dropdown-list' ? ['Option 1', 'Option 2'] : [],
      randomizeOptionsInd: false,
      placeholder: questionTypeId === 'single-line-input' ? 'Enter your answer...' : undefined,
      cards: [],
      programmerNotes: '',
      instructions: ''
    };

    this.questions.push(newQuestion);
    
    this.selectedQuestionType = null;
    
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
    // Resetting question IDs sequentially
    this.questions.forEach((q, i) => {
      q.questionId = i + 1;
    });
    this.nextQuestionId = this.questions.length + 1;
  }
}