import { Directive, input, model, computed } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Directive({
    selector: '[formFieldUiControl]',
    standalone: true,
    host: {
        '[attr.aria-disabled]': 'disabled() || null',
        '[attr.aria-required]': 'required() || null',
        '[attr.data-error]': 'hasError() || null',

        // Base classes
        'class': 'w-full group px-3 py-1 relative flex flex-col justify-center text-left min-h-9 block cursor-default rounded-md shadow-xs outline-1 -outline-offset-1 transition-colors duration-200 bg-[oklch(1_0_0)] dark:bg-[oklch(30%_2%_253deg)] text-[oklch(0.145_0_0)] dark:text-neutral-50 outline-black/13 dark:outline-white/4 focus-within:outline-black/18 dark:focus-within:outline-white/5',

        // Disabled state bindings
        '[class.shadow-none]': 'disabled()',
        '[class.bg-transparent]': 'disabled()',
        '[class.text-gray-600]': 'disabled()',
        '[class.cursor-not-allowed]': 'disabled()',
        '[class.disabled]': 'disabled()',

        // Complex state bindings (classes with special characters)
        '[class]': 'dynamicClasses()',
    },
})
export class FormFieldUiControl implements FormValueControl<unknown> {
    value = model<unknown>();

    required = input(false);
    disabled = input(false);
    touched = model(false);
    invalid = input(false);
    dirty = input(false);
    errors = input<readonly WithOptionalField<ValidationError>[]>([]);

    hasError = computed(() => this.invalid() && this.touched());

    dynamicClasses = computed(() => {
        const classes: string[] = [];

        if (this.disabled()) {
            classes.push(
                'dark:text-neutral-600',
                'outline-black/8',
                'dark:outline-white/4',
                'bg-[repeating-linear-gradient(45deg,rgb(0_0_0/_0.01),rgb(0_0_0/_0.01)_10px,rgb(0_0_0/_0.03)_10px,rgb(0_0_0/_0.03)_20px)]',
                'dark:bg-[repeating-linear-gradient(45deg,rgb(255_255_255/_0.01),rgb(255_255_255/_0.01)_10px,rgb(255_255_255/_0.03)_10px,rgb(255_255_255/_0.03)_20px)]'
            );
        }

        if (this.hasError()) {
            classes.push('outline-red-700/15', 'dark:outline-red-300/10');
        }

        return classes.join(' ');
    });
}
