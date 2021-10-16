import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive, forwardRef, Attribute } from '@angular/core';

@Directive({
    selector:
        '[masch-validateEqual][formControlName],[masch-validateEqual][formControl],[masch-validateEqual][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => EqualValidator),
            multi: true
        }
    ]
})
export class EqualValidator implements Validator {
    constructor(
        @Attribute('masch-validateEqual') public validateEqual: string
    ) {}

    validate(c: AbstractControl): { [key: string]: any } {
        // self value (e.g. retype password)
        let v = c.value;

        // control value (e.g. password)
        let e = c.root.get(this.validateEqual);

        // value not equal
        if (e && v !== e.value)
            return {
                validateEqual: false
            };
        return null;
    }
}
