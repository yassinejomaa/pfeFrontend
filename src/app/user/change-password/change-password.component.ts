import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FirstKeyPipe, CommonModule, ReactiveFormsModule, CommonModule, FirstKeyPipe],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class ChangePasswordComponent implements OnInit {
  form!: FormGroup;
  isSubmitted: boolean = false;
  email!: String;

  constructor(private formBuilder: FormBuilder, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.email = userData.email;
    }

    this.form = this.formBuilder.group({
      email: [this.email],
      currentPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
      confirmPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): null | object {
    const pass = control.get('newPassword');
    const re_pass = control.get('confirmPassword');

    if (pass && re_pass && pass.value !== re_pass.value) {
      re_pass.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control?.invalid && (control?.touched || this.isSubmitted);
  }
  
  

  onSubmit() {
    this.isSubmitted = true;
  
    if (this.form.invalid) {
      if (this.form.hasError('passwordMismatch')) {
        this.toastr.error("Passwords do not match", "Validation Error");
      }
      return;
    }
  
    this.service.resetPassword(this.form.value).subscribe({
      next: () => {
        this.toastr.success('Password Updated successfully', 'Update Password');
      },
      error: (err) => {
        console.error('Error details:', err);  // Afficher les détails complets de l'erreur dans la console
  
        // Vérifie si l'erreur provient d'un serveur
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message, 'Update Failed'); // Message personnalisé depuis le serveur
        } else if (err.status) {
          // Si un code d'état est retourné, on l'affiche aussi
          this.toastr.error(`Error ${err.status}: ${err.statusText}`, 'Update Failed');
        } else {
          // Erreur générale
          this.toastr.error('An unknown error occurred', 'Update Failed');
        }
      }
    });
  }
  
}
