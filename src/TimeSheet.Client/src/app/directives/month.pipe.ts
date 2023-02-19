import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'month',
})
export class MonthPipe implements PipeTransform {
  transform(value: number): Date {
    const year = new Date(Date.now()).getFullYear();
    return new Date(year, value, 1);
  }
}
