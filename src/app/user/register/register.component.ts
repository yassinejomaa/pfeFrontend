import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule,CommonModule,FirstKeyPipe,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  form: FormGroup; 

  constructor(private formBuilder: FormBuilder,private service:AuthService,private toastr:ToastrService) {
    this.form = this.formBuilder.group({
      first_Name: ['', Validators.required],
      last_Name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
      re_pass: ['']
    }, { validators: this.passwordMatchValidator });
  }
  isSubmitted:boolean=false;

  passwordMatchValidator(control: AbstractControl): null {
    const pass = control.get('password'); // Correction de 'pass' à 'password'
    const re_pass = control.get('re_pass');
    if (pass && re_pass) {
      if (pass.value !== re_pass.value) {
        re_pass?.setErrors({ passwordMismatch: true });
        this.toastr.error('Passwords do not match', 'Registration Failed'); // Afficher le message d'erreur
      } else {
        re_pass?.setErrors(null);
      }
    }
    return null;
  }
  

  // FontAwesome Icons
  faUser = faUser;
  faEmail = faEnvelope;
  faPhone = faPhone;
  faLock = faLock;
  onSubmit() {
    this.isSubmitted = true;
  
    
    if (this.form.get('password')?.value !== this.form.get('re_pass')?.value) {
      this.toastr.error("Passwords do not match", "Validation Error");
      return; 
    }
  
    if (this.form.valid) {
      this.service.createUser(this.form.value).subscribe({
        next: (res: any) => {
          console.log(this.form.value);
          this.toastr.success('Processing your request...', 'Please wait');
  
          if (res.succeeded) {
            this.form.reset();
            this.isSubmitted = false;
            this.toastr.success('New user created', 'Registration Successful');
          }
        },
        error: (err: { error: { errors: Array<{ code: string }> } }) => {
          console.log(this.form.value);
          if (err.error && err.error.errors) {
            err.error.errors.forEach((x: { code: string }) => {
              switch (x.code) {
                case "DuplicateEmail":
                  this.toastr.error('Email is already taken', 'Registration Failed');
                  break;
                default:
                  this.toastr.error('Contact the administration', 'Registration Failed');
                  break;
              }
            });
          } else {
            this.toastr.error('An unknown error occurred', 'Registration Failed');
          }
        }
      });
  
    } else {
      this.toastr.error('Please fill all required fields correctly', 'Validation Error');
    }
  }
  
  
  
  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.isSubmitted || control.touched) ? true : false;
  }
  
}
