
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isvisible'
})
export class IsvisiblePipe implements PipeTransform {

	transform(collections: any[]): any[] {
		if (!collections) return [];
		return collections.filter( collection => {
			return (collection.is_visible) ? true : false;
		});
	}

}
