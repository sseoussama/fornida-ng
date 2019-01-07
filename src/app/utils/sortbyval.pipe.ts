import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "valSort"
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any[], field: string, dir?:boolean): any[] {
    if (!array) { return []; }

    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });

    return (dir) ? array.reverse() : array;
  }
}
