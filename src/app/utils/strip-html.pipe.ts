import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strip'
})
export class StripHtmlPipe implements PipeTransform {

	transform(value: string): any {
    	return value.replace(/<.*?>/g, '');
	}

}
