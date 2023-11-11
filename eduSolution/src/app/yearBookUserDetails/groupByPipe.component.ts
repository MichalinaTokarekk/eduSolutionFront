// group-by.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(collection: any[], property: string): any {
    if (!collection) {
      return null;
    }

    const groupedCollection: { [key: string]: any[] } = {};

    collection.forEach(item => {
      const key = item[property];
      if (!groupedCollection[key]) {
        groupedCollection[key] = [];
      }
      groupedCollection[key].push(item);
    });

    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
}
