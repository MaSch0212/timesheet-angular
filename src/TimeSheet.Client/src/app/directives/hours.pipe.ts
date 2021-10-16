import { Pipe, PipeTransform } from '@angular/core';
import { Helpers } from '../common/helpers';

@Pipe({
    name: 'hours'
})
export class HoursPipe implements PipeTransform {
    transform(value: number) {
        return Helpers.getTimeStringFromHours(value);
    }
}
