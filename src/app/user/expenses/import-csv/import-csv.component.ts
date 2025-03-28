import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ExpenseService } from '../../../shared/services/expense.service';
import { FormsModule } from '@angular/forms';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-import-csv',
  standalone: true,
  imports: [ ToastModule, ButtonModule,FormsModule],
  templateUrl: './import-csv.component.html',
  styleUrl: './import-csv.component.css'
})
export class ImportCsvComponent {
  constructor(private messageService: MessageService,private expenseService:ExpenseService) {}

  
  fileSelection(event: any) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
  
    this.expenseService.importCsv(formData).subscribe({
      next: (result) => {
        console.log(result);
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
        window.location.reload();

      },
      error: (error) => {
        console.error("Upload error:", error);
        this.messageService.add({ severity: 'error', summary: 'Upload Failed', detail: error.message || 'An error occurred while uploading the file.' });
      }
    });
  }
  



}
