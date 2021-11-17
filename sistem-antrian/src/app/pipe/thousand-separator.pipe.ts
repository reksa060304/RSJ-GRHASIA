import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousandSeparator'
})
export class ThousandSeparatorPipe implements PipeTransform {

  transform(value: any): any {
    return value.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g,"$&.");
  }

}
