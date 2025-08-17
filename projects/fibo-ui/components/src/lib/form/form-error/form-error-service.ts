import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export interface FormErrorOptions {
  showOnlyFirst?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FormErrorService {
  
  private defaultErrorMessages: { [key: string]: string | ((error: any) => string) } = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minlength: (error: any) => `Minimum length is ${error.requiredLength} characters`,
    maxlength: (error: any) => `Maximum length is ${error.requiredLength} characters`,
    min: (error: any) => `Minimum value is ${error.min}`,
    max: (error: any) => `Maximum value is ${error.max}`,
    pattern: 'Please enter a valid format',
    requiredTrue: 'This field must be checked',
    emailExists: 'This email is already registered',
    usernameExists: 'This username is already taken',
    passwordMismatch: 'Passwords do not match',
    invalidDate: 'Please enter a valid date',
    invalidTime: 'Please enter a valid time',
    invalidUrl: 'Please enter a valid URL',
    invalidPhone: 'Please enter a valid phone number',
    invalidZipCode: 'Please enter a valid zip code',
    invalidCreditCard: 'Please enter a valid credit card number',
    invalidSSN: 'Please enter a valid SSN',
    invalidIP: 'Please enter a valid IP address',
    invalidDomain: 'Please enter a valid domain name',
    invalidColor: 'Please enter a valid color code',
    invalidHex: 'Please enter a valid hexadecimal value',
    invalidAlpha: 'Please enter only letters',
    invalidNumeric: 'Please enter only numbers',
    invalidAlphanumeric: 'Please enter only letters and numbers',
    invalidSpecialChars: 'Please do not use special characters',
    whitespace: 'This field cannot contain only whitespace',
    futureDate: 'Date cannot be in the future',
    pastDate: 'Date cannot be in the past',
    ageRestriction: (error: any) => `You must be at least ${error.minAge} years old`,
    fileSize: (error: any) => `File size must be less than ${error.maxSize}MB`,
    fileType: (error: any) => `File type must be one of: ${error.allowedTypes.join(', ')}`,
    uniqueValue: 'This value must be unique',
    serverError: 'An error occurred. Please try again.',
    networkError: 'Network error. Please check your connection.',
    timeout: 'Request timed out. Please try again.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access denied.',
    notFound: 'The requested resource was not found.',
    conflict: 'This resource conflicts with existing data.',
    tooManyRequests: 'Too many requests. Please try again later.',
    maintenance: 'System is under maintenance. Please try again later.',
    custom: (error: any) => error.message || 'Invalid value'
  };

  /**
   * Get error message for a specific error key and value
   */
  getErrorMessage(errorKey: string, errorValue?: any): string {
    const message = this.defaultErrorMessages[errorKey];
    
    if (typeof message === 'function') {
      return message(errorValue);
    }
    
    return message || `Invalid value for ${errorKey}`;
  }

  /**
   * Get all error messages for a control
   */
  getErrorMessages(control: AbstractControl, options: FormErrorOptions = {}): string[] {
    if (!control || !control.errors) {
      return [];
    }

    const errors = control.errors;
    const errorMessages: string[] = [];
    const { showOnlyFirst = false } = options;

    for (const [errorKey, errorValue] of Object.entries(errors)) {
      const message = this.getErrorMessage(errorKey, errorValue);
      errorMessages.push(message);
      
      if (showOnlyFirst) {
        break;
      }
    }

    return errorMessages;
  }

  /**
   * Get the first error message for a control
   */
  getFirstErrorMessage(control: AbstractControl): string | null {
    const messages = this.getErrorMessages(control, { showOnlyFirst: true });
    return messages.length > 0 ? messages[0] : null;
  }

  /**
   * Check if a control has errors and should display them
   */
  shouldShowError(control: AbstractControl): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Get error messages only if they should be displayed
   */
  getDisplayableErrorMessages(control: AbstractControl, options: FormErrorOptions = {}): string[] {
    if (!this.shouldShowError(control)) {
      return [];
    }
    return this.getErrorMessages(control, options);
  }

  /**
   * Get the first displayable error message
   */
  getFirstDisplayableErrorMessage(control: AbstractControl): string | null {
    if (!this.shouldShowError(control)) {
      return null;
    }
    return this.getFirstErrorMessage(control);
  }

  /**
   * Get all available error message keys
   */
  getAvailableErrorKeys(): string[] {
    return Object.keys(this.defaultErrorMessages);
  }
} 