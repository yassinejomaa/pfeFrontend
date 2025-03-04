import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FontAwesomeModule,RouterLink,CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
   faLock = faLock;
   faEmail = faEnvelope;
   faFacebook = faFacebook;
   faTwitter = faTwitter;
   faYoutube = faYoutube;
   constructor(public formBuilder:FormBuilder,private service:AuthService,private router:Router,private toastr:ToastrService){
    this.form=this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
   }
   isSubmitted:boolean=false;

   hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.isSubmitted || control.touched) ? true : false;
  }
  onSubmit() {
    this.isSubmitted = true;
    console.log(this.form.value);
    
    if (this.form.valid) {
        this.service.signin(this.form.value).subscribe({
            next: (res: any) => {
                console.log(res);
                localStorage.setItem('token', res.token);
                localStorage.setItem('userData',res.userData);
                this.router.navigateByUrl('/mainPage');
            },
            error: (err) => {
                if (err.status == 400) {
                    this.toastr.error('Incorrect email or password', 'Login failed');
                } else {
                    console.log('error during login');
                }
            }
        });
    }
}

  }

