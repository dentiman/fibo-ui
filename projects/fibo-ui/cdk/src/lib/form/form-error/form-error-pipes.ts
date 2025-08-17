import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormErrorService, FormErrorOptions } from './form-error-service';

@Pipe({
  name: 'formError',
  standalone: true,
  pure: false
})
export class FormErrorPipe implements PipeTransform {
  
  constructor(private formErrorService: FormErrorService) {}

  transform(
    control: AbstractControl | null | undefined, 
    options: FormErrorOptions = {}
  ): string[] {
    if (!control) {
      return [];
    }
    
    return this.formErrorService.getDisplayableErrorMessages(control, options);
  }
}

@Pipe({
  name: 'firstFormError',
  standalone: true,
  pure: false
})
export class FirstFormErrorPipe implements PipeTransform {
  
  constructor(private formErrorService: FormErrorService) {}

  transform(control: AbstractControl | null | undefined): string | null {
    if (!control) {
      return null;
    }
    
    return this.formErrorService.getFirstDisplayableErrorMessage(control);
  }
}

@Pipe({
  name: 'hasFormError',
  standalone: true,
  pure: false
})
export class HasFormErrorPipe implements PipeTransform {
  
  constructor(private formErrorService: FormErrorService) {}

  transform(control: AbstractControl | null | undefined): boolean {
    if (!control) {
      return false;
    }
    
    return this.formErrorService.shouldShowError(control);
  }
}
