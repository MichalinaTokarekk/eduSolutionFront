import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        if (!value) return null;
        if (!args) return value;

        if (typeof args === 'string') {
            args = args.toLowerCase();

            return value.filter((item: any) => {
                return JSON.stringify(item).toLowerCase().includes(args);
            });
        }

        return value;
    }
}
