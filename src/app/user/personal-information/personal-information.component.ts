import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NgxDropzoneModule, ToastModule],
  providers: [MessageService],
  templateUrl: './personal-information.component.html',
  styleUrls: [
    './personal-information.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css'
  ]
})
export class PersonalInformationComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  PhoneNumber: string = '';
  Email: string = '';
  form!: FormGroup;
  isSubmitted = false;
  files: File[] = [];
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private service: UserService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      avatar: [''],
      totalNumberOfFamilyMembers:[''],
      totalNumberOfFamilyMembersEmployed:[''],
      totalNumberOfCars:[''],
      totalNumberOfBedrooms:['']
    });
  
    const userDataString = localStorage.getItem("userData");
  
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        
        if (userData) {
          console.log("Données récupérées du localStorage :", userData);
  
          this.form.patchValue({
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phoneNumber: userData.phoneNumber || '',
            avatar: userData.avatar || '',
            totalNumberOfFamilyMembers: userData.totalNumberOfFamilyMembers|| '',
            totalNumberOfFamilyMembersEmployed: userData.totalNumberOfFamilyMembersEmployed || '',
            totalNumberOfCars: userData.totalNumberOfCars || '',
            totalNumberOfBedrooms: userData.totalNumberOfBedrooms || ''
          });
  
          // Load existing avatar if available
          if (userData.avatar) {
            this.showAvatar(userData.avatar);
          }
        } else {
          console.log("Aucune donnée utilisateur trouvée.");
        }
      } catch (error) {
        console.error("Erreur lors de la conversion JSON :", error);
      }
    } else {
      console.log("Aucune donnée trouvée dans localStorage.");
    }
  }
  
  // Load existing avatar image
  showAvatar(imageUrl: string) {
    if (!imageUrl) return;
    
    // Reset files array
    this.files = [];
    
    // Set the preview directly from URL
    this.imagePreview = imageUrl;
    
    // Optional: Convert URL to File object for consistency with upload flow
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        const file = new File([blob], fileName, { type: blob.type || 'image/png' });
        this.files.push(file);
      })
      .catch(error => {
        console.error("Erreur lors du chargement de l'image:", error);
      });
  }

  async onSubmit() {
    this.isSubmitted = true;
    
    if (this.form.valid) {
      // Upload image first if there's a new one
      if (this.files.length > 0 && this.imagePreview !== this.form.get('avatar')?.value) {
        try {
          await this.uploadFile();
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error);
          this.toastr.error("Erreur lors de l'upload de l'image", 'Erreur');
          return;
        }
      }
      
      console.log("Données envoyées :", JSON.stringify(this.form.value));

      this.service.update(this.form.value).subscribe({
        next: (res: any) => {
          console.log("Réponse du serveur :", res);
          localStorage.setItem('userData', JSON.stringify(this.form.value));
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User information updated successfully!',
            life: 3000
          });
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour :", err);
          this.toastr.error('error', 'Erreur');
        }
      });
    } else {
      console.error("Le formulaire est invalide !");
      this.toastr.error('Veuillez corriger les erreurs du formulaire', 'Erreur');
    }
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.isSubmitted || control.touched) ? true : false;
  }

  onSelect(event: any) {
    // Reset files array and add new files
    this.files = [];
    this.files.push(...event.addedFiles);

    // Preview the first file if available
    if (this.files.length > 0) {
      const file = this.files[0];
      const fileReader = new FileReader();
      
      fileReader.onload = () => {
        this.imagePreview = fileReader.result;
      };
      
      fileReader.readAsDataURL(file);
    }
    console.log(this.files[0])
  }

  onRemove(event: any) {
    // Remove file from files array
    this.files.splice(this.files.indexOf(event), 1);
    
    // Reset image preview
    this.imagePreview = null;
    
    // Reset form avatar value
    this.form.get('avatar')?.setValue('');
  }

  uploadFile = async () => {
    if (!this.files[0]) {
      return;
    }

    const file = this.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'projetWeb');
    formData.append('cloud_name', 'dimj6qkuf');

    try {
      // Use the service method to upload the file
      const response = await this.service.uploadFile(formData).toPromise();
      console.log('Upload response:', response);
      
      // Set the avatar URL in the form
      if (response && response.url) {
        this.form.get('avatar')?.setValue(response.url);
        return response;
      } else {
        throw new Error('Invalid response from Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  onRemoveExisting() {
    this.form.get('avatar')?.setValue('');
    this.imagePreview = null;
    this.files = [];
  }

  
}