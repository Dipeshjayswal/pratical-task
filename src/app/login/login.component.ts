import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatCardModule,MatButtonModule,MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: UntypedFormGroup;
  loading = false;
  errorMessage = '';
  constructor(public apiService:ApiService, private fb: FormBuilder, private router: Router){
    this.loginForm = this.fb.group({
      // username: ['emilys', [Validators.required, Validators.minLength(3)]],
      // password: ['emilyspass', [Validators.required, Validators.minLength(6)]]
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.loginApi();
  }

  get formControls() {
    return this.loginForm.controls;
  }

  loginApi(){
    this.loading = true;
    this.errorMessage = '';
    this.apiService.post({
      path: 'auth/login',
      data: {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
        expiresInMins: 30
      },
    }).subscribe((response : any) => {
      this.loading = false;
      console.log(response)
      if (response.accessToken) {
        localStorage.setItem('userData', JSON.stringify(response));
        this.router.navigate(['/dashboard']); // Navigate to dashboard
      }else {
        this.errorMessage = response.message;
        console.log(response.message)
      }
    }, (error) => {
      this.loading = false;
      this.errorMessage = error.error.message;
      console.log(error.error.message)
    })
  }

}
