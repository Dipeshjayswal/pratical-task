import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskSearch',
  standalone: true
})
export class TaskSearchPipe implements PipeTransform {

  transform(tasks: any[], searchTerm: string): any[] {
    if (!searchTerm) return tasks;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerCaseSearch) ||
      task.description.toLowerCase().includes(lowerCaseSearch)
    );
  }

}
