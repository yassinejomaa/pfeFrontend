import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-information',
  standalone: true,

  imports: [ReactiveFormsModule, CommonModule, RouterLink],

  templateUrl: './personal-information.component.html',
  styleUrls: [
    './personal-information.component.css',
    '../../../../public/css/teamplate/style.css',
    '../../../../public/css/teamplate/typography.css',
    '../../../../public/css/teamplate/responsive.css'
  ]
})
export class PersonalInformationComponent implements OnInit {
  first_Name: string = '';
  last_Name: string = '';
  PhoneNumber: string = '';
  Email: string = '';
  form!: FormGroup; // ✅ Enlever "?" et utiliser "!" pour garantir l'initialisation
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      last_Name: ['', Validators.required],
      first_Name: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  
    const userDataString = localStorage.getItem("userData");
  
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
  
        if (userData) {
          console.log("Données récupérées du localStorage :", userData);
  
          this.form.patchValue({
            email: userData.email || '',
            first_Name: userData.first_Name || '',
            last_Name: userData.last_Name || '',
            phoneNumber: userData.phoneNumber || ''
          });
  
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
  

  onSubmit() {
    this.isSubmitted = true;
    console.log("Valeurs du formulaire :", this.form.value);

    if (this.form.valid) {
      console.log("Envoi de la requête PUT à :", this.service.baseUrl + '/update');
      console.log("Données envoyées :", JSON.stringify(this.form.value));

      this.service.update(this.form.value).subscribe({
        next: (res: any) => {
          console.log("Réponse du serveur :", res);
          localStorage.setItem('userData', JSON.stringify(this.form.value));
          this.toastr.success('User updated successfully', 'Success');
          setTimeout(() => {
            window.location.reload();
          }, 1000); // 1000 ms = 1 seconde


        },
        error: (err) => {
          console.error("Erreur lors de la mise à jour :", err);
        }
      });
    } else {
      console.error("Le formulaire est invalide !");
    }
  }
  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.isSubmitted || control.touched) ? true : false;
  }

}
