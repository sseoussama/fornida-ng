import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {

  transform(str: string): any {
    return (!str.endsWith("s")) ? str+'s' : str;
  }

}


@Pipe({
  name: 'single'
})
export class SinglePipe implements PipeTransform {

  transform(str: string): any {
    return (str.endsWith("s")) ? str.substring(0, str.length - 1) : str;
  }

}
