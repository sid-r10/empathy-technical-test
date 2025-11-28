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
  saveSuccess = false;
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
  surveyId: number | null = null;

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
      id: '',
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
    if (this.questions.length >= this.maxQuestions) {
      alert(`Maximum ${this.maxQuestions} questions allowed.`);
      return;
    }
    console.log('Questions: ', this.questions);
    
    // Convert question type string to number
    const questionTypeNumber = this.getQuestionTypeNumber(questionTypeId);
  
    const newQuestion: Question = {
      questionId: this.nextQuestionId++,
      questionText: '',
      questionType: questionTypeNumber,
      mandatoryInd: false,
      options: ['Option 1', 'Option 2'], // Initialize with default options
      randomizeOptionsInd: false,
      cards: [],
      programmerNotes: '',
      instructions: ''
    };
  
    // Ensure options is initialized for choice types
    if (questionTypeId === 'single-choice' || 
        questionTypeId === 'multiple-choice' || 
        questionTypeId === 'dropdown-list') {
      newQuestion.options = ['Option 1', 'Option 2'];
    } else {
      newQuestion.options = [];
    }
  
    this.questions.push(newQuestion);
    this.selectedQuestionType = null;
    
    // Save survey to API automatically
    this.saveSurvey();
  }

  // Add a new question of the same type as the last question
  addAnotherQuestion(): void {
    if (this.questions.length >= this.maxQuestions) {
      alert(`Maximum ${this.maxQuestions} questions allowed.`);
      return;
    }

    if (this.questions.length === 0) {
      // No questions exist, user should select from menu
      return;
    }

    // Get the last question's type and convert it to string for the function
    const lastQuestion = this.questions[this.questions.length - 1];
    const lastQuestionTypeString = this.getQuestionTypeString(lastQuestion.questionType);
    
    // Add a question of the same type
    this.onQuestionTypeClick(lastQuestionTypeString);
  }

  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
    // Resetting question IDs sequentially
    this.questions.forEach((q, i) => {
      q.questionId = i + 1;
    });
    this.nextQuestionId = this.questions.length + 1;
  }

  // Get options array for a specific question
getQuestionOptions(questionIndex: number): string[] {
  return this.questions[questionIndex].options || [];
}

// Add a new option to a question
addOption(questionIndex: number): void {
  if (!this.questions[questionIndex].options) {
    this.questions[questionIndex].options = [];
  }
  this.questions[questionIndex].options!.push('');
}

// Remove an option from a question
removeOption(questionIndex: number, optionIndex: number): void {
  if (this.questions[questionIndex].options) {
    this.questions[questionIndex].options!.splice(optionIndex, 1);
  }
}

// Update an option value
updateOption(questionIndex: number, optionIndex: number, value: string): void {
  if (this.questions[questionIndex].options) {
    this.questions[questionIndex].options![optionIndex] = value;
  }
}

// Update question type (converts string from dropdown to number)
updateQuestionType(questionIndex: number, questionTypeString: string): void {
  this.questions[questionIndex].questionType = this.getQuestionTypeNumber(questionTypeString);
}

// TrackBy function for better performance in *ngFor
trackByOptionIndex(index: number): number {
  return index;
}

// Add this function
saveSurvey(): void {
  // Validate survey has title
  if (!this.surveyTitle || this.surveyTitle.trim() === '') {
    this.error = 'Survey title is required';
    this.saveSuccess = false;
    return;
  }

  // Validate at least one question exists
  if (this.questions.length === 0) {
    this.error = 'Please add at least one question';
    this.saveSuccess = false;
    return;
  }

  // Allow saving even with empty question text (user can fill it later)
  // Remove strict validation for question text

  this.loading = true;
  this.error = null;
  this.saveSuccess = false;

  // Build survey payload
  const surveyPayload: CreateSurveyRequest = {
    id: 'uss1',
    title: this.surveyTitle,
    description: this.surveySubtitle,
    questions: this.questions.map((q, index) => ({
      questionId: index,
      questionText: q.questionText || '', // Allow empty question text
      mandatoryInd: q.mandatoryInd || false,
      questionType: q.questionType, // Already a number, no conversion needed
      options: q.options || [],
      randomizeOptionsInd: q.randomizeOptionsInd || false,
      cards: q.cards || [],
      programmerNotes: q.programmerNotes || '',
      instructions: q.instructions || ''
    }))
  };

  // Call API service
  this.surveyService.createSurvey(surveyPayload, this.userEmail).subscribe({
    next: (res) => {
      this.saveSuccess = true;
      this.loading = false;
      this.error = null;
      console.log('Survey saved successfully:');
      console.log('Status:', res.id);
      console.log('Headers:', res.title);      
      
      // Clear success message after 2 seconds
      setTimeout(() => {
        this.saveSuccess = false;
      }, 2000);
    },
    error: (err) => {
      this.error = 'Failed to save survey. Please try again.';
      this.loading = false;
      this.saveSuccess = false;
      console.error('Error saving survey:', err);
    }
  });
}

// Helper function to convert question type string to number
getQuestionTypeNumber(questionType: string): number {
  const typeMap: { [key: string]: number } = {
    'single-choice': 0,
    'multiple-choice': 1,
    'single-line-input': 2,
    'dropdown-list': 3
  };
  return typeMap[questionType] || 0;
}

// Helper function to convert question type number to string
getQuestionTypeString(questionType: number): string {
  const typeMap: { [key: number]: string } = {
    0: 'single-choice',
    1: 'multiple-choice',
    2: 'single-line-input',
    3: 'dropdown-list'
  };
  return typeMap[questionType] || 'single-choice';
}

// Helper function to check if question type is single-line-input
isSingleLineInput(questionType: number): boolean {
  return questionType === 2;
}
}