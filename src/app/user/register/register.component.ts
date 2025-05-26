import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLock, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirstKeyPipe } from '../../shared/pipes/first-key.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { faUsers, faHome } from '@fortawesome/free-solid-svg-icons';
import { faBriefcase, faTractor } from '@fortawesome/free-solid-svg-icons';
import { faCamera ,faTimes } from '@fortawesome/free-solid-svg-icons';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FontAwesomeModule, ReactiveFormsModule,CommonModule,FirstKeyPipe,RouterLink,NgxDropzoneModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css']
})
export class RegisterComponent implements OnInit{
  form: FormGroup; 
  myFiles: [] = [];
  step: number = 1;
  faUsers = faUsers;
faHome = faHome;
faBriefcase = faBriefcase;  // Icône pour le travail (job)
faTractor = faTractor; 
faCamera = faCamera;
faTimes = faTimes;
  ngOnInit(): void {
    if(this.service.isLoggedIn()){
      this.router.navigateByUrl("/mainPage");
  
    }
  }
  constructor(private formBuilder: FormBuilder,private service:AuthService,private toastr:ToastrService,private router:Router,private userService:UserService) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[^a-zA-Z0-9])/)
      ]],
      avatar:'',
      re_pass: [''],
      totalNumberOfFamilyMembers:null,
      totalNumberOfFamilyMembersEmployed:null,
      totalNumberOfCars:null,
      totalNumberOfBedrooms:null
    }, { validators: this.passwordMatchValidator });
  }
  isSubmitted:boolean=false;

  passwordMatchValidator(control: AbstractControl): null {
    const pass = control.get('password'); 
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
  uploadFiles = async () => {
    if (!this.files[0]) {
      
      return;
    }
  
    try {
      for (const file of this.files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'projetWeb');
        formData.append('cloud_name', 'dimj6qkuf');
        console.log(formData);
        
        const response = await this.userService.uploadFile(formData).toPromise();
        console.log(response.url)
        this.form.get('avatar')!.setValue(response.url);
         
        console.log(this.form.get('avatar'));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  uploadFile = async () => {
    if (!this.files[0]) {
      alert('No file selected!');
      return;
    }
  
    const file = this.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'projetWeb');
    formData.append('cloud_name', 'dimj6qkuf');
  
    try {
      // Await the response from the asynchronous uploadFile service method
      const response = await this.userService.uploadFile(formData).toPromise();
      console.log("hello");
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  onRemove(file: File) {
    this.files = this.files.filter(f => f !== file);
  }
  
  onRemoveExisting() {
    this.imagePreview = null;
    this.files = []; // pour être sûr que l'autre image disparaît aussi
  }
  
    
  
  
  async onSubmit() {
    this.isSubmitted = true;
    await this.uploadFiles();
  console.log(this.form.value)
    
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
            this.router.navigateByUrl('/login');
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

  serverOptions = () => {
    console.log('server pond');
    allowMultiple: false
    return {
      process: (file: string | Blob, load: (arg0: any) => void, abort: () => void) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'projetWeb');
        data.append('cloud_name', 'dimj6qkuf');
        data.append('public_id', file);
        this.userService.uploadFile(data)
          .subscribe(
            (data) => {
              console.log(data);
              if (this.form.get('avatar')) {
                this.form.get('avatar')!.setValue(data.url);
              }
              
              load(data);
              console.log(data.url)
            },
            (error) => {
              console.error('Error uploading file:', error);
              error('Upload failed');
              abort();
            }
          );
      }
    };
  };
  files: File[] = []
  imagePreview: string | ArrayBuffer | null = null;
  onSelect(event: any) {
    // Réinitialisez les fichiers
    this.files = [];
    this.files.push(...event.addedFiles);

    // Si au moins un fichier est chargé
    if (this.files.length > 0) {
        const file = this.files[0]; // Utilisez le premier fichier

        // Créez un FileReader
        const fileReader = new FileReader();

        // Lorsque le fichier est chargé, mettez à jour imagePreview
        fileReader.onload = () => {
            this.imagePreview = fileReader.result;
            console.log(this.imagePreview)
        };

        // Lisez le fichier en tant que DataURL
        fileReader.readAsDataURL(file);
    }
}
nextStep() {
    // Validate only step 1 fields before proceeding
    const step1Valid = this.form.get('firstName')?.valid && 
                      this.form.get('lastName')?.valid&&this.form.get('phoneNumber')?.valid
                      &&this.form.get('email')?.valid
                      &&this.form.get('password')?.valid&&this.form.get('re_pass')?.valid ;
    
    if (step1Valid) {
        this.step = 2;
    } else {
        // Mark step 1 fields as touched to show validation messages
        this.form.get('firstName')?.markAsTouched();
        this.form.get('lastName')?.markAsTouched();
        this.form.get('phoneNumber')?.markAsTouched();
        this.form.get('email')?.markAsTouched();
        this.form.get('password')?.markAsTouched();
        this.form.get('re_pass')?.markAsTouched();
    }
}

previousStep() {
    this.step = 1;
}

}