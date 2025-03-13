import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';



@Component({
  selector: 'app-add-update-form',
  standalone: true,
  imports: [MatDialogModule,FormsModule,CommonModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatSelectModule],
  templateUrl: './add-update-form.component.html',
  styleUrl: './add-update-form.component.scss'
})
export class AddUpdateFormComponent implements OnInit {
  taskForm: FormGroup;
  categories = ['Work', 'Personal', 'Others'];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUpdateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.taskForm.patchValue(this.data);
      console.log(this.data);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const taskData = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        priority: this.taskForm.value.priority,
        category: this.taskForm.value.category,
        complated: this.data?.complated ? this.data?.complated :  false,
        id: this.data?.id ? this.data?.id : new Date().getTime()
      };
      const existingTasks = JSON.parse(localStorage.getItem('taskData') || '[]');
      console.log(existingTasks);
      if (this.data) {
        const taskIndex = existingTasks.findIndex((t: any) => t.id === this.data.id);
        if (taskIndex !== -1) {
          existingTasks[taskIndex] = taskData;
        }
      } else {
        existingTasks.unshift(taskData);
      }

      localStorage.setItem('taskData', JSON.stringify(existingTasks));
      this.dialogRef.close(taskData);
    }
  }



 closeDialog(): void {
    this.dialogRef.close(false);
  }
}
