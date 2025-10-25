# @fibo-ui/cdk

Core development kit for Fibo UI components. This library provides essential directives, form controls, utilities, and building blocks for creating Angular UI components.

## Installation

```bash
npm install @fibo-ui/cdk
```

## Features

### Common Directives
- **AutoFocus**: Automatically focuses elements when they become visible
- **DataActive**: Manages active state for interactive elements
- **IsEmpty**: Utility directive for checking empty states
- **PrimitiveValueAccessor**: Base class for form controls
- **RandomId**: Generates unique IDs for elements

### Form Components & Services
- **Form Field Control**: Base interface for form field controls
- **Form Field Content**: Manages form field content structure
- **Form Field Errors**: Error handling and display utilities
- **Form Error Service**: Centralized error management
- **Control Status**: Form control state management
- **Form Field Popover Trigger**: Popover integration for form fields

### Data List Directives
- **Data List**: Base directive for list components
- **List Item**: Individual list item management
- **Selection Models**: Various selection strategies for lists

### Popover Directives
- **Popover Trigger**: Triggers popover display
- **Popover Position**: Manages popover positioning
- **Popover Arrow**: Arrow indicator for popovers
- **Popover**: Core popover functionality

### Utility Functions
- **Property Utils**: Common property manipulation utilities

## Usage

### Basic Import

```typescript
import { AutoFocusDirective, FormFieldControl } from '@fibo-ui/cdk';
```

### Using Directives

```typescript
import { Component } from '@angular/core';
import { AutoFocusDirective } from '@fibo-ui/cdk';

@Component({
  selector: 'app-example',
  template: `
    <input autoFocus placeholder="This input will be focused automatically" />
  `,
  imports: [AutoFocusDirective]
})
export class ExampleComponent {}
```

### Form Field Control

```typescript
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormFieldControl } from '@fibo-ui/cdk';

@Component({
  selector: 'app-custom-input',
  template: `
    <input 
      [value]="value"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: CustomInputComponent
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor, FormFieldControl {
  value = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
```

## Requirements

- Angular 20.1.0 or higher
- TypeScript 5.8.2 or higher

## Peer Dependencies

- `@angular/common`: ^20.1.0
- `@angular/core`: ^20.1.0

## Development

### Building the Library

```bash
ng build @fibo-ui/cdk --configuration=production
```

### Running Tests

```bash
ng test @fibo-ui/cdk
```

### Publishing

```bash
cd dist/fibo-ui/cdk
npm publish
```

## License

MIT

## Contributing

Please read our [contributing guidelines](https://github.com/your-org/fibo-ui/blob/main/CONTRIBUTING.md) before submitting pull requests.

## Support

- [Documentation](https://github.com/your-org/fibo-ui#readme)
- [Issues](https://github.com/your-org/fibo-ui/issues)
- [Discussions](https://github.com/your-org/fibo-ui/discussions)
