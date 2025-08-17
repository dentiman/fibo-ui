import { Pipe, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';

@Pipe({
  name: 'isEmpty',
  standalone: true
})
export class IsEmptyPipe implements PipeTransform {
  transform(value:unknown): boolean {
    return value === null || value === '' || (Array.isArray(value) && value.length === 0);
  }
}
