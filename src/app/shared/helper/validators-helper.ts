import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Validatore per numeri positivi (minimo 1) */
export function positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && (value < 1 || value < 0 || isNaN(value))) {
            return { 'positiveNumber': { value: control.value } };
        }
        return null;
    };
}


