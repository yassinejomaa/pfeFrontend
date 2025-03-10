import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-enter-mail',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './enter-mail.component.html',
  styleUrls:[ './enter-mail.component.css',
    '../../../../../public/css/teamplate/style.css',
    '../../../../../public/css/teamplate/typography.css',
    '../../../../../public/css/teamplate/responsive.css']
})
export class EnterMailComponent {
    form: FormGroup;
    isSubmitted:boolean=false;
  
constructor(public formBuilder:FormBuilder,private service:UserService,private router:Router,private toastr:ToastrService){
    this.form=this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],})
      
}

hasDisplayableError(controlName: string): boolean {
  const control = this.form.get(controlName);
  return control?.invalid && (this.isSubmitted || control.touched) ? true : false;
}

  onSubmit() {
    console.log({...this.form.value,clienturi: 'http://localhost:4200/resetPassword'});
    this.isSubmitted = true;
    
    if (this.form.valid) {
        this.service.forgotPassword({...this.form.value,
          clienturi: 'http://localhost:4200/resetPassword'}).subscribe({
            next: (res: any) => {
              this.toastr.success('check your email', 'email send');
            },
            error: (err) => {
                if (err.status == 400) {
                  console.log(err);
                    this.toastr.error('Incorrect email', 'send failed');
                } else {
                    console.log('error during login');
                }
            }
        });
    }
}



}
