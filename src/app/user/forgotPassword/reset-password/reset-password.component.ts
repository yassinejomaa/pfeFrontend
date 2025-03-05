import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.css',
    '../../../../../public/css/teamplate/style.css',
    '../../../../../public/css/teamplate/typography.css',
    '../../../../../public/css/teamplate/responsive.css'
  ]
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  email: string = '';
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword:['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = decodeURIComponent(params['token'] || '');
      this.email = params['email'] || '';

      console.log('Decoded Token:', this.token);
      console.log('Email:', this.email);
    });
  }

  onSubmit() {
    console.log({
      ...this.form.value,
      token: this.token,
      email: this.email,
    });

    this.isSubmitted = true;

    if (this.form.valid) {
      this.service
        .resetPassword({
          ...this.form.value,
          email: this.email,
          token: this.token,
        })
        .subscribe({
          next: (res: any) => {
            this.toastr.success('Password modified successfully', 'Success');
            this.router.navigateByUrl('/login');
          },
          error: (error) => {
            console.error('Erreur complète:', error);
            if (error.error && error.error.errors) {
              console.error('Détails des erreurs :', error.error.errors);
            }
          },
        });
    }
  }
}
