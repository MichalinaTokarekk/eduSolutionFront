// import { Pipe, PipeTransform } from "@angular/core";

// @Pipe({
//     name: 'search'
// })

// export class SearchPipe implements PipeTransform {
//     transform(value: any, args?: any): any {
//         if (!value) return null;
//         if (!args) return value;

//         if (typeof args === 'string') {
//             args = args.toLowerCase();

//             return value.filter((item: any) => {
//                 return JSON.stringify(item).toLowerCase().includes(args);
//             });
//         }

//         return value;
//     }
// }

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    const auditFields = ['createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
    
    // Filtrujemy audytowe pola
    value = value.map((item: any) => {
      const newItem: any = {};
      Object.keys(item).forEach(key => {
        if (!auditFields.includes(key)) {
          newItem[key] = item[key];
        }
      });
      return newItem;
    });

    if (typeof args === 'string') {
      args = args.toLowerCase();

      return value.filter((item: any) => {
        if (item.hasOwnProperty('difficultyLevel')) {
            return this.itemContainsSearchTermForCourse(item, args);
          } else if(item.hasOwnProperty('startDate')) {
            return this.itemContainsSearchTermForSemester(item, args);
          } else if(item.hasOwnProperty('address')) {
            return this.itemContainsSearchTermForUser(item, args);
          } else {
            return this.itemContainsSearchTerm(item, args);
          } 
      });
    }

    return value;
  }

  

private isAuditField(field: string): boolean {
    const auditFields = ['createdBy', 'createdAt', 'updatedBy', 'updatedAt'];
    return auditFields.includes(field);
  }
  
  private itemContainsSearchTerm(item: any, searchTerm: string): boolean {
    const searchableFields = ['name', 'description', 'studentsLimit', 'year', 'address', 'classGroupStatus', 'mode', 'semester', 'course'];
    const searchTerms = searchTerm.split(' ').filter(term => term.trim() !== '');
  
    return searchTerms.every(term => {
      return searchableFields.some(field => {
        if (this.isAuditField(field)) {
          return true; // Ignorujemy audytowe pola
        }
  
        const columnValue = item[field];
  
        if (field === 'studentsLimit') {
          return columnValue !== null && columnValue !== undefined && columnValue.toString().includes(term);
        } else if (typeof columnValue === 'number' || typeof columnValue === 'string') {
          return columnValue !== null && columnValue !== undefined && columnValue.toString().toLowerCase().includes(term.toLowerCase());
        } else if (typeof columnValue === 'object' && columnValue !== null) {
          // Obsługa enumów (np. status, mode)
          const objectKeys = Object.keys(columnValue) as any[];
return objectKeys.some(key => {
  const value = columnValue[key];
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString().toLowerCase().includes(term.toLowerCase());
  }
  return false;
});

        } else {
          return false;
        }
      });
    });
  }
  


  
 




  private itemContainsSearchTermForCourse(item: any, searchTerm: string): boolean {
    const searchableFields = ['name', 'amountToPay', 'cashAdvance', 'difficultyLevel', 'description'];
    const searchTerms = searchTerm.split(' ').filter(term => term.trim() !== '');
  
    return searchTerms.every(term => {
      return searchableFields.some(field => {
        if (field === 'difficultyLevel') {
          const difficultyLevel = item[field];
          // Sprawdź, czy pole difficultyLevel zawiera szukaną frazę
          return difficultyLevel !== null && difficultyLevel !== undefined && difficultyLevel.toString().toLowerCase().includes(term.toLowerCase());
        }
  
        const columnValue = item[field];
        if (typeof columnValue === 'number' || typeof columnValue === 'string') {
          return columnValue !== null && columnValue !== undefined && columnValue.toString().toLowerCase().includes(term.toLowerCase());
        } else if (typeof columnValue === 'object' && columnValue !== null) {
          // Obsługa enumów (np. difficultyLevel)
          const objectEntries = Object.entries(columnValue) as any[];
          return objectEntries.some(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              return value.toString().toLowerCase().includes(term.toLowerCase());
            }
            return false;
          });
        } else {
          return false;
        }
      });
    });
  }

  private itemContainsSearchTermForSemester(item: any, searchTerm: string): boolean {
    const searchableFields = ['name', 'startDate', 'endDate'];
    const searchTerms = searchTerm.split(' ').filter(term => term.trim() !== '');
  
    return searchTerms.every(term => {
      return searchableFields.some(field => {
        if (field === 'startDate') {
          const startDate = item[field];
          // Sprawdź, czy pole difficultyLevel zawiera szukaną frazę
          return startDate !== null && startDate !== undefined && startDate.toString().toLowerCase().includes(term.toLowerCase());
        }
  
        const columnValue = item[field];
        if (typeof columnValue === 'number' || typeof columnValue === 'string') {
          return columnValue !== null && columnValue !== undefined && columnValue.toString().toLowerCase().includes(term.toLowerCase());
        } else if (typeof columnValue === 'object' && columnValue !== null) {
          // Obsługa enumów (np. difficultyLevel)
          const objectEntries = Object.entries(columnValue) as any[];
          return objectEntries.some(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              return value.toString().toLowerCase().includes(term.toLowerCase());
            }
            return false;
          });
        } else {
          return false;
        }
      });
    });
  }
  
  private itemContainsSearchTermForUser(item: any, searchTerm: string): boolean {
    const searchableFields = ['email', 'firstName', 'lastName', 'address', 'city', 'post', 'postCode', 'country', 'role', 'userStatus', 'classGroups'];
    const searchTerms = searchTerm.split(' ').filter(term => term.trim() !== '');
  
    return searchTerms.every(term => {
      return searchableFields.some(field => {
        if (field === 'startDate') {
          const startDate = item[field];
          // Sprawdź, czy pole difficultyLevel zawiera szukaną frazę
          return startDate !== null && startDate !== undefined && startDate.toString().toLowerCase().includes(term.toLowerCase());
        }
  
        const columnValue = item[field];
        if (typeof columnValue === 'number' || typeof columnValue === 'string') {
          return columnValue !== null && columnValue !== undefined && columnValue.toString().toLowerCase().includes(term.toLowerCase());
        } else if (typeof columnValue === 'object' && columnValue !== null) {
          // Obsługa enumów (np. difficultyLevel)
          const objectEntries = Object.entries(columnValue) as any[];
          return objectEntries.some(([key, value]) => {
            if (typeof value === 'string' || typeof value === 'number') {
              return value.toString().toLowerCase().includes(term.toLowerCase());
            }
            return false;
          });
        } else {
          return false;
        }
      });
    });
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}

