import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateFormComponent } from '../add-update-form/add-update-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { TaskSearchPipe } from '../pipes/task-search.pipe';
import { Route, Router } from '@angular/router';

interface Task {
  title: string;
  description: string;
  priority: number;
  category: string;
  complated: boolean;
  id: number;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    TaskSearchPipe,
    MatDialogModule,
    MatSelectModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild('todoList') todoList!: CdkDropList;
  @ViewChild('doneList') doneList!: CdkDropList;
  PRIORITY: Record<number, string> = {
    1: 'High',
    2: 'Medium',
    3: 'Low'
  };

  todo: Task[] = [];
  done: Task[] = [];
  selectedCate = 'All';
  searchTerm: string = '';
  sortDirection: { [key: string]: 'asc' | 'desc' | 'none' } = { todo: 'none', done: 'none' };
  constructor(public dialog:MatDialog, public router:Router){
    const taskList: Task[] = JSON.parse(localStorage.getItem('taskData') || '[]');

    this.todo = taskList.filter((item: Task) => !item.complated);
    this.done = taskList.filter((item: Task) => item.complated);
    console.log(this.todo);
    console.log(this.done);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      if (event.container.id === 'cdk-drop-list-1') {
        task.complated = true;
      } else if (event.container.id === 'cdk-drop-list-0') {
        task.complated = false;
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const updatedTasks = [...this.todo, ...this.done];
      localStorage.setItem('taskData', JSON.stringify(updatedTasks));
    }
    this.sortDirection = { todo: 'none', done: 'none' };
  }


  filterCategory(category:string){
    this.selectedCate = category;
    const taskList: Task[] = JSON.parse(localStorage.getItem('taskData') || '[]');
    if (category === 'All') {
      this.todo = taskList.filter((item: Task) => !item.complated);
      this.done = taskList.filter((item: Task) => item.complated);
    } else {
      this.todo = taskList.filter((item: Task) => !item.complated && category === item.category);
      this.done = taskList.filter((item: Task) => item.complated && category === item.category);
    }
    // console.log('this.todo', this.todo);
    // console.log('this.todo', this.done);
  }

  openDialog(task: any = null, list: 'todo' | 'done' = 'todo', index?: number) {
    this.dialog.open(AddUpdateFormComponent,
      { data: task, width: '800px', disableClose: true }
    ).afterClosed().subscribe((result) => {
      // console.log(result);
      if (result) {
        // if (task) {
        //   this[list][index!] = result;
        // } else {
        //   // this.todo.unshift(result);
        // }
        this.selectedCate = 'All';
        const taskList: Task[] = JSON.parse(localStorage.getItem('taskData') || '[]');
        this.todo = taskList.filter((item: Task) => !item.complated);
        this.done = taskList.filter((item: Task) => item.complated);


      }
    });
  }

  deleteList(items:string,index:any){
    if (items === 'done') {
      this.done.splice(index, 1);
    } else if (items === 'todo') {
      this.todo.splice(index, 1);
    }

    const updatedTasks = [...this.todo, ...this.done];
    localStorage.setItem('taskData', JSON.stringify(updatedTasks));
  }

  getPriorityClass(priority: number): string {
    switch (priority) {
      case 1:
        return 'priority high';
      case 2:
        return 'priority medium';
      case 3:
        return 'priority low';
      default:
        return '';
    }
  }

  sortTasks(order: 'asc' | 'desc' | 'none', list: 'todo' | 'done') {
    const otherList = list === 'todo' ? 'done' : 'todo';
    this.sortDirection[otherList] = 'none';
  
    this.sortDirection[list] = order;
    if (order === 'none') {
      const taskList: Task[] = JSON.parse(localStorage.getItem('taskData') || '[]');
      this[list] = list === 'todo' ? taskList.filter((item: Task) => !item.complated) : taskList.filter((item: Task) => item.complated);
      return;
    }
    const targetList = list === 'todo' ? this.todo : this.done;
    targetList.sort((a, b) => order === 'asc' ? a.priority - b.priority : b.priority - a.priority);
  }

  logoutUser(){
    window.localStorage.clear();
    this.router.navigate(['/login']); // Navigate to dashboard
  }

}
