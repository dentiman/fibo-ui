# @fibo-ui/components

A comprehensive Angular UI component library with modern design and accessibility features. Built with Angular 20+ and Tailwind CSS.

## Features

- 🎨 **Modern Design**: Clean, accessible components with Tailwind CSS styling
- 🚀 **Angular 20+**: Built with the latest Angular features including signals and standalone components
- ♿ **Accessibility**: WCAG compliant components with proper ARIA attributes
- 📱 **Responsive**: Mobile-first design approach
- 🎯 **TypeScript**: Full TypeScript support with strict typing
- 🔧 **Customizable**: Easy theming and customization options

## Installation

```bash
npm install @fibo-ui/components
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install @angular/common@^20.1.0 @angular/core@^20.1.0 @angular/forms@^20.1.0 @angular/platform-browser@^20.1.0 @angular/router@^20.1.0 @floating-ui/dom@^1.7.3 date-fns@^4.1.0 lucide-angular@^0.539.0 ngxtension@^5.1.0 rxjs@~7.8.0 tailwindcss@^4.1.12
```

## Quick Start

1. **Import the components** in your Angular application:

```typescript
import { Component } from '@angular/core';
import { LoadingSpin, Dialog, DialogTrigger, Confirmation, Notification } from '@fibo-ui/components';

@Component({
  selector: 'app-root',
  imports: [LoadingSpin, Dialog, DialogTrigger, Confirmation, Notification],
  template: `
    <fibo-loading-spin [isLoading]="loading"></fibo-loading-spin>
    
    <fibo-dialog-trigger>
      <button>Open Dialog</button>
      <fibo-dialog>
        <h2>Dialog Title</h2>
        <p>Dialog content goes here</p>
      </fibo-dialog>
    </fibo-dialog-trigger>
    
    <fibo-confirmation>
      <button>Confirm Action</button>
    </fibo-confirmation>
  `
})
export class AppComponent {
  loading = false;
}
```

2. **Configure Tailwind CSS** in your project to include the component styles.

## Available Components

### Currently Available (v0.0.1)
- **Loading Spin** - Loading indicators
- **Dialog** - Modal dialogs with customizable content
- **Confirmation** - Confirmation dialogs
- **Notification** - Toast notifications

### Coming Soon
The following components are being prepared for future releases. They are currently excluded due to a TypeScript compilation issue with CDK dependencies:

#### Form Components
- **Input** - Text input with floating labels and validation states
- **Select** - Dropdown selection with search and custom templates
- **Multiple Select** - Multi-selection dropdown with tags
- **Checkbox** - Custom checkbox with indeterminate state
- **Switch** - Toggle switch component
- **Datepicker** - Date selection with calendar
- **Date Range Picker** - Date range selection

#### Navigation Components
- **Menu** - Context menus and navigation
- **Side Menu** - Collapsible sidebar navigation
- **Popover Menu** - Floating menu component

#### Additional Components
- **Tooltip** - Contextual tooltips
- **Table** - Data tables with sorting and filtering
- **Listbox** - Selectable list component
- **Data List** - Generic data listing component

## Styling

All components are styled with Tailwind CSS. Make sure to include Tailwind CSS in your project and configure it to scan the component files.

## Development

### Building the Library

```bash
ng build components
```

### Publishing

1. Build the library:
   ```bash
   ng build components
   ```

2. Navigate to the dist directory:
   ```bash
   cd dist/fibo-ui/components
   ```

3. Publish to npm:
   ```bash
   npm publish
   ```

### Testing

```bash
ng test components
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/your-org/fibo-ui#readme)
- 🐛 [Report Issues](https://github.com/your-org/fibo-ui/issues)
- 💬 [Discussions](https://github.com/your-org/fibo-ui/discussions)
