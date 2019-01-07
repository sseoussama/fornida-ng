declare var require: any;
require('fast-filter').install('select');
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {

  transform(products: any, searchText: string): any[] {

    if (!products) { return []; }
    if (!searchText) { return products; }

    searchText = searchText.toLowerCase();

    // too slow (replace native filter with above)
    return products.select( product => {
      return JSON.stringify(product).toLowerCase().includes(searchText);
    });

  }
}
